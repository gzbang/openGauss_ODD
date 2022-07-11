import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';

/**
 * 获取授权的相关回调链接
 */
export function queryCourse(id: string) {
  const url = `https://omapi.osinfra.cn/query/lts/2203?community=opengauss&user=${id}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

export function getGiteeId() {
  const url = '/2203ltscontribution/oauth2/userinfo';
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}
