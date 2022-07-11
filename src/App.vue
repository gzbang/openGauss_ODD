<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';

import html2canvas from 'html2canvas';

import { queryUserInfo, getGiteeId } from '@/api/api';

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
      queryUserInfo(name.value).then((rlt) => {
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

const posterIns = ref({});
const invitationIns = ref({});
const websiteIns = ref({});

const imgLoaded = ref(false);
const handleBgLoaded = function () {
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
        html2canvas(posterIns.value as HTMLElement, {
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
  <div ref="posterIns" class="poster">
    <!-- 背景大图 -->
    <img class="poster-bg" src="./assets/bg1.png" alt="" @load="handleBgLoaded" />

    <!-- 标语 -->
    <div class="poster-slogan">
      <p>openGauss开源两周年</p>
      <p>秀出你的专属贡献</p>
    </div>

    <!-- 文字内容 -->
    <div class="poster-content">
      <img class="poster-content-bg" src="./assets/back.jpg" alt="" />

      <template v-if="datas.length">
        <div class="user-info">
          <div class="user-info-name">
            <p>
              <span>我是</span> <span>{{ name }}</span>
            </p>
            <p>我在openGauss社区贡献了：</p>
          </div>

          <div class="user-info-detail">
            <div v-for="item in datas" :key="item.key" class="detail-item">
              <p>
                <span> {{ item.label }}： </span>
                <span :style="{ fontStyle: 'italic' }">{{ item.value }}</span>
              </p>
            </div>
          </div>

          <div class="user-info-slogan">
            <p>一起来参加openGauss Developer Day 2022吧！</p>
            <p>我参与，我做主</p>
          </div>
        </div>
      </template>

      <template v-if="loaded && datas.length == 0">
        <div class="poster-content-empty">
          <p>一起来参与</p>
          <p>openGauss Developer Day 2022吧，</p>
          <p>共建开源数据库根社区!</p>
          <p :style="{ marginTop: '8%' }">我参与，我做主。</p>
        </div>
      </template>
    </div>

    <!-- 底部 -->
    <footer class="poster-footer" :class="{ disappear: disappear }">
      <div class="footer-tips" :class="{ disappear: disappear }" :style="{ marginBottom: `${datas.length ? '16px' : '32px'}` }">
        {{ '< <  长按识别二维码  > >' }}
      </div>

      <div class="footer-qrcode">
        <div class="qrcode-item">
          <img ref="invitationIns" class="qrcode-img" src="./assets/invitation-qrcode.png" alt="invitation" />
          <div class="qrcode-font" :class="{ disappear: disappear }">扫码生成贡献报告</div>
        </div>
        <div class="qrcode-item">
          <img ref="websiteIns" class="qrcode-img" src="./assets/websiteqrcode.png" alt="website" />
          <div class="qrcode-font" :class="{ disappear: disappear }">
            openGauss Developer Day <br />
            扫码报名
          </div>
        </div>
      </div>
    </footer>
  </div>

  <!-- 海报图片 -->
  <teleport v-if="loaded" to="#app">
    <img v-if="imgSrc" :src="imgSrc" class="poster-img" />
  </teleport>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  display: flex;
  justify-content: center;

  .poster {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #18398c;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    color: #ffffff;
    text-align: center;
    line-height: 2rem;

    @media screen and (min-width: 1120px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 50vh;
      height: 100vh;
    }

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    &-bg-decorations {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    &-slogan {
      position: relative;
      z-index: 3;
      width: 100%;
      padding-top: 9vh;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      font-weight: 500;
      user-select: none;
      color: #000000;

      p {
        width: 100%;
        font-size: 2.5rem;
        line-height: 4rem;
      }
    }

    &-content {
      position: absolute;
      z-index: 888;
      left: 50%;
      transform: translateX(-50%);
      top: 38vh;
      width: 100%;
      height: 30vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .poster-content-bg {
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
      }

      &-empty {
        font-weight: 500;
        font-size: 1.5rem;
        line-height: 3rem;
      }

      .user-info {
        padding-top: 3.2vh;
        padding-bottom: 3vh;
        position: relative;
        width: 100%;
        height: 100%;
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .user-info-slogan {
          font-size: 1.2rem;
          line-height: 2rem;
          font-weight: 500;
          position: absolute;
          bottom: 0;
          width: 100%;
          transform: translateY(calc(100% + 10px));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}

.poster-img {
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

.poster-footer {
  // background: url(./assets/foot-back.png) no-repeat;
  // background-size: cover;
  // width: 100vw;
  // height: 23vh;
  padding-bottom: 20px;
  position: relative;
  z-index: 1000;

  &.disappear {
    background: none;
  }

  .footer-tips {
    font-size: 1.1rem;
    color: #ffffff;
    user-select: none;
    letter-spacing: 1px;
    margin-bottom: 16px;
    opacity: 0.8;

    &.disappear {
      opacity: 0;
    }
  }

  .footer-qrcode {
    display: flex;
    padding: 0 1rem;

    .qrcode-item {
      width: 50%;

      .qrcode-img {
        border-radius: 8px;
        position: relative;
        width: 8rem;
        height: 8rem;
        z-index: 1000;
      }

      .qrcode-font {
        position: relative;
        font-size: 12px;
        line-height: 1.5rem;
        margin-top: 0.5rem;

        &.disappear {
          opacity: 0;
        }
      }
    }
  }
}
</style>
