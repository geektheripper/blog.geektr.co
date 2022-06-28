<template>
  <footer>
    <div class="footer-internal">
      <img class="avatar" src="./geektr-rotate.svg" alt="@GeekTR" />
      <section class="description">
        <p>
          @GeekTR //志在互联网，所好者繁，染拖延之疾，久治未愈，
          <span title="现在没有了，嘘~">有乔翁之心</span>，奈何命定庸人。
        </p>
      </section>
      <section class="badges">
        <Badge
          href="https://github.com/geektheripper"
          label="GitHub"
          message="@geektheripper"
          color="2a88f6"
          logo="github"
        />
        <Badge
          href="https://git.geektr.co/geektr"
          label="GitLab"
          message="@geektr"
          color="fc6d26"
          logo="gitlab"
        />
        <Badge
          href="https://twitter.com/geektheripper"
          label="Twitter"
          message="@geektheripper"
          color="1da1f2"
          logo="twitter"
        />
        <Badge
          href="https://space.bilibili.com/3162440/dynamic"
          label="Bilibili"
          message="@GeekTR"
          color="f45a8d"
          :logo="badges.bilibili"
        />
        <Badge
          href="tencent://message/?uin=598957591"
          label="QQ"
          message="@598957591"
          color="1da1f2"
          logo="tencent-qq"
        />
        <Badge
          href="mailto:geektr@ch-postal.com?subject=%5BFrom%20Blog%5D%20Your%20Subject"
          label="Mail"
          message="geektr@ch-postal.com"
          color="violet"
          :logo="badges.chPostal"
        />
      </section>
    </div>
  </footer>
</template>

<script>
import { Base64 } from "js-base64";
import Badge from "./badges";
import bilibiliBrandSvg from "!raw-loader!./badges/bilibili.svg";
import chPostalBrandSvg from "!raw-loader!./badges/ch-postal.svg";

const base64Svg = t => "data:image/svg+xml;base64," + Base64.encode(t);

export default {
  components: { Badge },
  computed: {
    badges() {
      return {
        bilibili: base64Svg(bilibiliBrandSvg),
        chPostal: base64Svg(chPostalBrandSvg)
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
footer
  background-color #333

.footer-internal
  min-height 5rem
  margin 0 auto
  max-width $textAreaWidth
  padding 2rem 5rem
  display flex
  flex-wrap wrap

.avatar
  width 5rem
  height 5rem
  margin-right 1rem

.description
  flex 1
  min-width 150px
  margin-right 1rem
  color white

  p
    margin-block-start 0
    margin-block-end 0.5rem

.badges>*
  display block

@media (max-width: $MQMobile)
  .footer-internal
    padding 2rem
</style>
