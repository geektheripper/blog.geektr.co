---
title: awscli Commands
tags:
  - shell-logs
  - bash
categories:
  - shell-logs
date: 2019-10-28 16:15:28
---

## .profile

```bash
PS1_BACKUP="$PS1"
function init-aws {
    profile_name=$1
    export AWS_PROFILE=$profile_name
    aws_promopt="AWS $profile_name"
    aws_region=$(aws configure get region)
    if [ -n $aws_region ]; then
        aws_promopt="$aws_promopt $aws_region"
    fi
    PS1="$PS1_BACKUP [$aws_promopt]: "
}

function op-init-aws {
    export AWS_ACCESS_KEY_ID=$(op-select $1 $2 AccessKeyID)
    export AWS_SECRET_ACCESS_KEY=$(op-select $1 $2 AccessKeySecret)
    PS1="$PS1_BACKUP [AWS $1 $2]: "
}

function init-ssh {
    eval $(ssh-agent -s)
    ssh-add "$HOME/.ssh/$1"
}
```
<!--more-->

## Usage

### VPC

```bash
init-aws geektr@geektr-aws

function ec2tag {
    aws ec2 create-tags --resources "$1" --tags "Key=Name,Value=$2"
}

# create vpc
aws ec2 create-vpc \
    --cidr-block 10.5.1.0/24 \
    --no-amazon-provided-ipv6-cidr-block
  # => vpcid=
ec2tag $vpcid DevelopEnvironment

# create internet gateway and attach to vpc
aws ec2 create-internet-gateway
  # => igwid=
ec2tag $igwid DevelopIGW

aws ec2 attach-internet-gateway \
    --internet-gateway-id $igwid \
    --vpc-id $vpcid

# create route table for vpc
aws ec2 describe-route-tables --filters Name=vpc-id,Values=$vpcid
  # => rtbid=
ec2tag $rtbid DevelopRouteTable

# route to internet
aws ec2 create-route \
    --route-table-id $rtbid \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id $igwid

# create ACL for vpc
aws ec2 describe-network-acls --filters Name=vpc-id,Values=$vpcid
  # => aclid=
ec2tag $aclid DevelopACL

# create subnet
aws ec2 create-subnet \
    --availability-zone ap-northeast-2a \
    --cidr-block 10.5.1.0/24 \
    --vpc-id $vpcid
  # => subnet_id=
ec2tag $subnet_id DevelopSubnet
```

### Security Group

```bash
# create security group
aws ec2 create-security-group \
    --description "ssh and web ports" \
    --group-name "DevelopApps" \
    --vpc-id $vpcid
  # => sg_id=

# add ingress rules
function sgadd() {
    aws ec2 authorize-security-group-ingress \
        --group-id $sg_id \
        --protocol $1 \
        --port $2 \
        --cidr $3
}

sgadd tcp 22 0.0.0.0/0
sgadd tcp 2222 0.0.0.0/0
sgadd tcp 80 0.0.0.0/0
sgadd tcp 443 0.0.0.0/0
```

### Create Instance

```bash
# Debian 9 / 2019-09-08
ami_id=ami-028bd1fbb6e7dc007

# import ssh keys
key_pair=root@geektr.co

aws ec2 import-key-pair \
  --key-name $key_pair \
  --public-key-material file://$HOME/.ssh/keys/geektr.co/root.pub

# create block-map.json and tags.json
tee block-map.json <<'END'
[
  {
    "DeviceName": "xvda",
    "Ebs": {
      "DeleteOnTermination": true,
      "VolumeSize": 30,
      "VolumeType": "gp2",
      "Encrypted": false
    }
  }
]
END

tee block-map.json <<'END'
[
  {
    "ResourceType": "instance",
    "Tags": [
      { "Key": "Name", "Value": "DevelopApps" },
      { "Key": "Remark", "Value": "Develop Workspaces" }
    ]
  }
]
END

# create instance
aws ec2 run-instances \
    --image-id $ami_id \
    --count 1 \
    --instance-type t3.medium \
    --key-name $key_pair \
    --security-group-ids $sg_id \
    --subnet-id $subnet_id \
    --associate-public-ip-address \
    --block-device-mappings file://block.json \
    --tag-specifications file://tags.json
  # => instance_id=
# get instance public ip
aws ec2 describe-instances --instance-ids $instance_id
  # => public_ip
```

### DNS

```bash
hosted_zone=
domain=workspace.geektr.co

tmp_dns_change_batch=$(tempfile)

tee $tmp <<END
{
    "Comment": "Workspace DNS record",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$domain",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$public_ip"
                    }
                ]
            }
        }
    ]
}
END

# apply dns changes
aws route53 change-resource-record-sets \
    --hosted-zone-id $hosted_zone \
    --change-batch file://$tmp_dns_change_batch
  # => change_id

# wait INSYNC
printf "waiting DNS INSYNC "
while ! aws route53 get-change --id $change_id | grep "INSYNC"; do
  printf '.'
  sleep 3
done
```


### S3

```bash
bucket_name=workspace-stroage
bucket_user=workspace-access@s3

# create bucket
aws s3api create-bucket \
    --bucket $bucket_name \
    --region ap-northeast-2 \
    --create-bucket-configuration LocationConstraint=ap-northeast-2 \
    --acl private

# create iam for s3 access
aws iam create-user \
    --path /develop-environment/workspace/ \
    --user-name $bucket_user

# create access policy json
tee s3-access-policy.json <<END
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "unspecified",
            "Effect": "Allow",
            "Action": [
              "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::$bucket_name",
                "arn:aws:s3:::$bucket_name/*",
            ]
        }
    ]
}
END

# apply s3 access policy
aws iam put-user-policy \
    --user-name $bucket_user \
    --policy-name $bucket_name-s3-access \
    --policy-document file://s3-access-policy.json

# generate accesss key
aws iam create-access-key \
    --user-name $bucket_user
```