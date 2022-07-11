<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';

import html2canvas from 'html2canvas';

import { queryCourse, getGiteeId } from '@/api/api';

interface dataObj {
  key: string;
  value: string;
  label: string;
}

interface StringObj {
  [index: string]: string;
}

const datas = ref([] as dataObj[]);
const name = ref('');
// name.value = 'pei-jiankang';
// name.value = 'wsp1991';
// name.value = 'lixianlin0';
const i18n: StringObj = {
  prs: 'PR',
  issues: 'Issue',
  comments: 'Comment',
};

const dataLoaded = ref(false);

try {
  getGiteeId().then((res) => {
    name.value = res.user;
    try {
      queryCourse(name.value).then((rlt) => {
        dataLoaded.value = true;

        const data = rlt.data || [];
        if (data.length) {
          Object.keys(i18n).forEach((item) => {
            const value = data[0][item];
            if (parseInt(value) > 0) {
              datas.value.push({
                key: item,
                value: data[0][item],
                label: i18n[item],
              });
            }
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
} catch (e) {
  console.error(e);
}

const wrapIns = ref({});
const invitationIns = ref({});
const websiteIns = ref({});

const imgLoaded = ref(false);
const handleOnload = function () {
  imgLoaded.value = true;
};

const loaded = computed(() => {
  return dataLoaded.value && imgLoaded.value;
});

const imgSrc = ref('');
const disappear = ref(false);
watch(
  () => {
    return loaded.value;
  },
  (val) => {
    if (val) {
      nextTick(() => {
        html2canvas(wrapIns.value as HTMLElement, {
          useCORS: true,
          allowTaint: true,
          // scale: 3,
        }).then((canvas) => {
          const img = new Image();
          // 导出图片地址
          img.src = canvas.toDataURL();
          imgSrc.value = canvas.toDataURL();
          setTimeout(() => {
            disappear.value = true;
          }, 0);
        });
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div ref="wrapIns" class="wrap common">
    <img class="wrap-bg" src="./assets/back.png" alt="" @load="handleOnload" />
    <div class="banner" :class="{ black: loaded }">
      <p>openGauss开源两周年</p>
      <p>秀出你的专属贡献</p>
    </div>
    <template v-if="datas.length">
      <div class="main-name">
        <span>我是</span>
        <span class="weight name">{{ name }}</span>
      </div>
      <div>
        <span> 在最新发布的openEuler 22.03 LTS版本中,<br />我贡献了: </span>
      </div>
      <div class="content">
        <div v-for="item in datas" :key="item.key" class="content-value">
          {{ item.label }}: <span>{{ item.value }}</span>
        </div>
      </div>
      <div class="m-b-2">
        一起来参加openEuler Developer Day <br />
        2022吧,共同服务万千用户!
      </div>
      <div class="m-b-2">我参与，我做主。</div>
    </template>
    <template v-if="loaded && datas.length == 0">
      <div class="no-data-back">
        <img class="no-data-back-bg" src="./assets/nodata-back.jpg" alt="" />
        <div class="middle">
          <p>一起来参与</p>
          <p>openGauss Developer Day 2022吧，</p>
          <p>共建开源数据库根社区</p>
        </div>
        <div>我参与，我做主。</div>
      </div>
    </template>
    <footer class="footer" :class="{ disappear: disappear }">
      <div class="m-b-2 long-press-text" :class="{ disappear: disappear }">
        {{ '< <  长按识别二维码  > >' }}
      </div>
      <div class="code">
        <div>
          <img ref="invitationIns" class="code-img" src="./assets/invitation-qrcode.png" alt="invitation" />
          <div class="code-font" :class="{ disappear: disappear }">扫码生成贡献报告</div>
        </div>
        <div>
          <img ref="websiteIns" class="code-img" src="./assets/websiteqrcode.png" alt="website" />
          <div class="code-font" :class="{ disappear: disappear }">
            openGauss Developer Day <br />
            扫码报名
          </div>
        </div>
      </div>
    </footer>
  </div>
  <teleport v-if="loaded" to="#app">
    <img v-if="imgSrc" :src="imgSrc" class="poster" />
  </teleport>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  display: flex;
  justify-content: center;
}

.poster {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 999;

  @media screen and (min-width: 1120px) {
    left: 50%;
    width: 50vh;
    transform: translateX(-50%);
  }
}

.wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #18398c;
  overflow: hidden;
  width: 100vw;
  // z-index: -1;
  height: 100vh;
  @media screen and (min-width: 1120px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100vh * 0.5);
    height: 100vh;
  }
  .wrap-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
  }
}

.common {
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  line-height: 2rem;
}

.no-data-back {
  position: relative;
  user-select: none;
  background-size: cover;
  width: 100%;
  height: 28rem;
  .head {
    color: #00e1b4;
    padding-top: 7rem;
  }
  .middle {
    margin-top: 3rem;
    margin-bottom: 3rem;
    line-height: 2.5rem;
  }

  div {
    position: relative;
    z-index: 1;
  }
  .no-data-back-bg {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 375px;
  }
}

.footer {
  background: url(./assets/foot-back.png) no-repeat;
  background-size: cover;
  // width: 100vw;
  // height: 23vh;
  padding-bottom: 20px;
  position: relative;
  z-index: 1000;
  &.disappear {
    background: none;
  }
}

.weight {
  font-weight: 500;
}
.m-b-2 {
  user-select: none;
  margin-bottom: 25px;
  &.disappear {
    opacity: 0;
  }
}
.long-press-text {
  font-size: 1.2rem;
  color: #7faaff;
}
.banner {
  width: 100%;
  padding: 6rem 1rem 14rem;
  padding-top: 6rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
  user-select: none;
  color: #000000;

  &.black {
    color: #000000;
  }

  p {
    width: 100%;
    font-size: 2.5rem;
    line-height: 4rem;
  }
  .banner-img {
    width: 100%;
  }
}
.main-name {
  margin-top: 3.5rem;
  padding-left: 32px;
  padding-right: 32px;
  word-break: break-all;
  .name {
    margin-left: 0.5rem;
  }
  margin-bottom: 1.8rem;
  @media screen and (min-width: 1120px) {
    margin: 0;
  }
}
.content {
  margin-top: 2rem;
  margin-bottom: 2rem;
  user-select: none;
  .content-value {
    background: url(./assets/font-back.png) no-repeat;
    background-size: cover;
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    span {
      margin-left: 1rem;
      font-size: 2rem;
      color: #00e1b4;
    }
  }
  @media screen and (min-width: 1120px) {
    margin: 0;
  }
}
.code {
  & > div {
    width: 50%;
  }
  display: flex;
  padding: 0 1rem;
  .code-img {
    width: 10rem;
    position: relative;
    z-index: 1000;
  }
  .code-font {
    position: relative;
    font-size: 14px;
    line-height: 1.5rem;
    margin-top: 0.5rem;

    &.disappear {
      opacity: 0;
    }
  }
}
</style>
