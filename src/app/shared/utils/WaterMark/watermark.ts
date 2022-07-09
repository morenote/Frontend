/**
 * 作者: 孙尊路
 * 创建时间: 2018-09-08 13:26:47
 * 版本: [1.0, 2018/09/08]
 * 说明： 生成水印
 */
/**
 * @description 生成水印
 * @param {Object} settings 配置项
 */

export class Watermark{
  constructor(settings:any) {
    //默认设置
    let defaultSettings:any = {
      watermark_txt: '水印', //水印字样
      watermark_x: 20, //水印起始位置x轴坐标
      watermark_y: 20, //水印起始位置Y轴坐标
      watermark_rows: 480, //水印行数
      watermark_cols: 10, //水印列数
      watermark_x_space: 50, //水印x轴间隔
      watermark_y_space: 50, //水印y轴间隔
      watermark_color: 'rgba(207.0/255.0, 207.0/255.0, 207.0/255.0, 1)', //水印字体颜色
      watermark_alpha: 0.1, //水印透明度
      watermark_fontsize: '20px', //水印字体大小
      watermark_font: 'Arial', //水印字体
      watermark_width: 200, //水印宽度
      watermark_height: 30, //水印长度
      watermark_angle: 20 //水印倾斜度数
    };
    //采用配置项替换默认值，作用类似jquery.extend
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      let src:any = arguments[0] || {};
      for (let key in src) {
        if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
        else if (src[key]) defaultSettings[key] = src[key];
      }
    }

    let oTemp:any = document.createDocumentFragment();

    //获取页面最大宽度
    let page_width:any = window.innerWidth - 20 || document.documentElement.clientWidth - 20 || document.body.clientWidth - 20;
    //获取页面最大长度(此处修改：孟亚文2019/12/25)
    let page_height:any = window.innerHeight - 20 || document.documentElement.clientHeight - 20 || document.body.clientHeight - 20;
    // var page_height = $('html').height();
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (
      defaultSettings.watermark_cols == 0 ||
      parseInt(
        defaultSettings.watermark_x +
        defaultSettings.watermark_width * defaultSettings.watermark_cols +
        defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
      ) > page_width
    ) {
      defaultSettings.watermark_cols = parseInt(
        String((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) /
          (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
      );
      defaultSettings.watermark_x_space = parseInt(
        String((page_width -
            defaultSettings.watermark_x -
            defaultSettings.watermark_width * defaultSettings.watermark_cols) /
          (defaultSettings.watermark_cols - 1))
      );
    }
    //  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (
      defaultSettings.watermark_rows == 0 ||
      parseInt(
        defaultSettings.watermark_y +
        defaultSettings.watermark_height * defaultSettings.watermark_rows +
        defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
      ) > page_height
    ) {
      defaultSettings.watermark_rows = parseInt(
        String((page_height - defaultSettings.watermark_y + defaultSettings.watermark_y_space) /
          (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
      );
      defaultSettings.watermark_y_space = parseInt(
        String((page_height -
            defaultSettings.watermark_y -
            defaultSettings.watermark_height * defaultSettings.watermark_rows) /
          (defaultSettings.watermark_rows - 1))
      );
    }

    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
      for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

        let mask_div:any = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        //设置水印div倾斜显示
        mask_div.style.webkitTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
        mask_div.style.MozTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
        mask_div.style.msTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
        mask_div.style.OTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
        mask_div.style.transform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
        mask_div.style.visibility = '';
        mask_div.style.position = 'fixed';
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = 'hidden';
        mask_div.style.zIndex = '9999';
        // mask_div.style.border="solid #eee 1px";
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = 'center';
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = 'block';
        // 增加div点击穿透属性
        mask_div.style.pointerEvents = 'none';
        oTemp.appendChild(mask_div);
      }
    }
    document.body.appendChild(oTemp);
  }
}
