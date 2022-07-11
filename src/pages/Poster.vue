<script setup lang="ts">
import { onMounted, ref } from 'vue';

import QrCode from 'qrcode-decoder';
import html2canvas from 'html2canvas';
import AlloyFinger from 'alloyfinger';

import { queryCourse, getGiteeId } from '@/api/api';

interface dataObj {
  key: string;
  value: string;
  label: string;
}

interface StringObj {
  [index: string]: string;
}
interface AnyObj {
  [index: string]: any;
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

getGiteeId().then((res) => {

  name.value = res.user;

  queryCourse(name.value).then((data) => {
    const _data = data?.data || [];
    const keys = Object.keys(i18n);
    if (_data.length) {
      keys.reduce((pre: dataObj[], next: string) => {
        const obj: dataObj = {
          key: next,
          value: _data[0][next],
          label: i18n[next],
        };
        pre.push(obj);
        return pre;
      }, datas.value);
    }
  });
});

// let downloadTime: NodeJS.Timeout;
// const cancelDownload = () => {
//   clearTimeout(downloadTime);
//   clearTimeout(time);
// };
// 下载海报
// const downloadImg = () => {
//   setTimeout(() => {
//     html2canvas(document.getElementById('download_img') as HTMLElement, {
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const img = new Image();
//       // 导出图片地址
//       img.src = canvas.toDataURL();
//       downloadMethod(img.src, '海报');
//     });
//   }, 3000);
// };
const downloadMethod = (imgsrc: string, name: string) => {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context?.drawImage(img, 0, 0, img.width, img.height);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = name || 'img';
    a.href = url;
    a.dispatchEvent(event);
  };
  img.src = imgsrc;
};
// let time: NodeJS.Timeout;
// const holdDown = (e: AnyObj) => {
//   time = setTimeout(() => {
//     if (e.target.nodeName === 'IMG') {
//       inentityQR(e.target.currentSrc).then((data: any) => {
//         window.open(data.data, '_blank');
//       });
//     }
//   }, 1500);
// };
// const holdUp = () => {
//   clearTimeout(time);
// };

const inentityQR = (url: string) => {
  const qr = new QrCode();
  return qr.decodeFromImage(url);
};

const wrapIns = ref({});
const invitationIns = ref({});
const websiteIns = ref({});

const handleQrcodeLongTap = (e: any) => {
  // e.stoppropagation();
  if (e.target.nodeName === 'IMG') {
    inentityQR(e.target.currentSrc).then((data: any) => {
      window.open(data.data, '_blank');
    });
  }
};

onMounted(() => {
  new AlloyFinger(wrapIns.value, {
    longTap: () => {
      html2canvas(wrapIns.value as HTMLElement, {
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const img = new Image();
        // 导出图片地址
        img.src = canvas.toDataURL();
        downloadMethod(img.src, 'ODD_Poster');
      });
    },
  });

  new AlloyFinger(invitationIns.value, {
    longTap: handleQrcodeLongTap,
  });

  new AlloyFinger(websiteIns.value, {
    longTap: handleQrcodeLongTap,
  });
});
</script>

<template>
  <div ref="wrapIns" class="wrap common">
    <div class="banner">
      <img class="banner-img" src="../assets/banner.png" alt="banner" />
    </div>
    <template v-if="datas.length">
      <div class="main-name">
        <span>我是</span>
        <span class="weight name">{{ name }}</span>
      </div>
      <div>
        <span> 在刚发布的openEuler 22.03 LTS版本中,<br />我贡献了: </span>
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
    <template v-else>
      <div class="no-data-back">
        <div class="head">openEuler 22.03 LTS版本已发布</div>
        <div class="middle">一起来参加openEuler Developer Day<br />2022吧, 共同服务万千用户!</div>
        <div>我参与，我做主。</div>
      </div>
    </template>
    <div class="m-b-2">{{ '< <  长按识别二维码  > >' }}</div>
    <footer class="footer">
      <div class="code">
        <div>
          <img ref="invitationIns" class="code-img" src="../assets/website-Qrcode.png" alt="invitation" />
          <div class="code-font">生成您的专属邀请函</div>
        </div>
        <div>
          <img ref="websiteIns" class="code-img" src="../assets/website-Qrcode.png" alt="website" />
          <div class="code-font">进入活动官网</div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
.wrap {
  background: url(../assets/back.png) no-repeat;
  background-size: cover;
  background-color: #0a0d37;
  width: 100vw;
}
.no-data-back {
  background: url(../assets/nodata-back.png) no-repeat;
  background-size: cover;
  width: 100%;
  height: 28rem;
  margin-top: 6rem;
  margin-bottom: 5rem;
  .head {
    padding-top: 7rem;
  }
  .middle {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
}
.footer {
  background: url(../assets/foot-back.png) no-repeat;
  background-size: cover;
  width: 100vw;
  height: 23vh;
}
.common {
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  line-height: 2rem;
}
.weight {
  font-weight: 500;
}
.m-b-2 {
  margin-bottom: 2rem;
}
.banner {
  width: 100%;
  padding-top: 5rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
  .banner-img {
    width: 100%;
  }
}
.main-name {
  margin-top: 3.5rem;
  .name {
    margin-left: 0.5rem;
  }
  margin-bottom: 1.8rem;
}
.content {
  margin-top: 2rem;
  margin-bottom: 2rem;
  .content-value {
    background: url(../assets/font-back.png) no-repeat;
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
}
.code {
  & > div {
    width: 50%;
  }
  display: flex;
  padding: 0 3rem;
  .code-img {
    width: 9rem;
  }
  .code-font {
    font-size: 1.2rem;
    line-height: 1.5rem;
    margin-top: 0.5rem;
  }
}
</style>
