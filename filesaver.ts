// https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js
// 绑定点击事件
const click = (node: HTMLElement) => {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    const evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    );
    node.dispatchEvent(evt);
  }
};

// 检查跨域
function corsEnabled(url: string) {
  var xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299;
}

/**
 * 获取文件的blob对象
 */
const fetchBlob = (url: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(xhr.statusText || "Download failed."));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Download failed."));
    };
    xhr.send();
  });
};

// 构造下载链接
const downloadURL = (url: string, name: string = "") => {
  const link = document.createElement("a");

  link.href = url;
  if ("download" in document.createElement("a")) {
    link.download = name;
    click(link);
  } else {
    // 对不支持download进行兼容
    link.target = "_blank";
    click(link);
  }
};

/** 下载文档
 *  @param {string} url       文件地址
 *  @param {string} filename  文件名称
 */
export default (url: string, filename: string) => {
  if (corsEnabled(url)) {
    return fetchBlob(url)
      .then((resp: any) => {
        if (resp.blob) {
          return resp.blob();
        } else {
          return new Blob([resp]);
        }
      })
      .then((blob) => {
        // 兼容ie/edge浏览器
        if ("msSaveOrOpenBlob" in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          const obj = URL.createObjectURL(blob);
          downloadURL(obj, filename);
          URL.revokeObjectURL(obj);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  } else {
    downloadURL(url, filename);
  }
};
