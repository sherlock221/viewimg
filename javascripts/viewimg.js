/**
 * 实现方式 firefox || chrome || safari HTML5 API IE || 7 || 8 || 9 filter IE6 src
 * 
 */
(function($) {

	/**
	 * 系统使用的常量
	 */
	var CONSTANT = {
		HTML5 : "html5",
		FILTER : "filter",
		BASE : "base",
		IMG_ERROR : "图片不合法",
		IMG_SUCCESS : "图片通过"
	}

	$.fn.viewimg = function() {

		var privateFn = {
			/**
			 * 初始化 绑定各类事件
			 * @param options
			 */
			init : function(options) {
				var $this = $(this);
				var _this = this;

				$.fn.viewimg.options = $
						.extend({}, $.fn.viewimg.options, options);

				// 绑定事件
				$this.bind("change", function(e) {

					// 清空对象
					$.fn.viewimg.options.targetDiv.html("");

					var isImg = privateFn.ckImg($.fn.viewimg.options.allowTypes,
							_this.value);
					if (isImg == CONSTANT.IMG_ERROR) {
						if ($.fn.viewimg.options.errorDiv)
							$.fn.viewimg.options.errorDiv
									.html(CONSTANT.IMG_ERROR);
						else
							alert(CONSTANT.IMG_ERROR);

					} else if (isImg == CONSTANT.IMG_SUCCESS) {
						var fn = privateFn.ckSupport();
						fn(_this);
					}
				});
			},

			/**
			 * 检测浏览器支持情况
			 * 
			 * @param path
			 * @returns fn
			 */
			ckSupport : function(path) {
				var supportRes = publicFn.suportHTML5();
				if (supportRes == CONSTANT.HTML5)
					return privateFn.fileRead;
				else if (supportRes == CONSTANT.FILTER)
					return privateFn.filterRead;
				else if (supportRes == CONSTANT.BASE)
					return privateFn.baseRead;

			},

			/**
			 * 检测后缀名是否图片格式
			 * 
			 * @param allowTypes
			 * @param imgSrc
			 * @returns null
			 */
			ckImg : function(allowTypes, imgSrc) {
				var i = 0;
				var regext = "";
				var ext = imgSrc.substring(imgSrc.lastIndexOf("."));
				// //console.log(ext);
				for (; i < allowTypes.length; i++) {
					if (ext == allowTypes[i]) {
						return CONSTANT.IMG_SUCCESS;
					}
				}
				return CONSTANT.IMG_ERROR;
			},

			/**
			 * HTML5 FileAPI 读取显示
			 * 
			 * @param dom
			 */
			fileRead : function(dom) {
				var fileList;
				var options = $.fn.viewimg.options;
				fileList = dom.files;

				for ( var i = 0; i < fileList.length; i++) {
					var file = fileList[i];
					var reader = new FileReader();
					reader.readAsDataURL(file);

					// 读取初始化事件
					reader.onload = function(e) {
						var img = new Image();
						img.src = e.target.result;
						img.total = e.total;
						img.onload = function() {
							// 图片处理
							privateFn.loadImg(img, CONSTANT.HTML5);
							img = null;
						}
					};
					reader.onprogress = function() {
					}
				}
			},

			/**
			 * IE7,8,9 滤镜来显示
			 * 
			 * @param dom
			 */
			filterRead : function(dom) {
				var options = $.fn.viewimg.options;
				dom.select();
				dom.blur();// 解决IE9下document.selection拒绝访问的错误
				var imgSrc = document.selection.createRange().text;
				privateFn.loadImg(imgSrc, CONSTANT.FILTER);
				document.selection.empty();
			},

			/**
			 * IE6 显示
			 * 
			 * @param dom
			 */
			baseRead : function(dom) {
				var imgSrc = dom.value;
				var $img = $("<img src='" + imgSrc + "'/>");
				privateFn.loadImg($img, CONSTANT.BASE);
			},

			/**
			 * 加载图片
			 * 
			 * @param $imgAuto
			 * @param browserType
			 */
			loadImg : function(img, browserType) {
				var options = $.fn.viewimg.options;
				if (browserType == CONSTANT.HTML5) {
					options.targetDiv.append(img);
					privateFn.imgZoom(options.targetDiv.find("img"),
							CONSTANT.HTML5);
				} else if (browserType == CONSTANT.FILTER) {
					var $container = options.targetDiv;
					// 获得图片原始尺寸
					$container.append($("<img id='viewimg_size'/>"));
					var $imgAuto = $("#viewimg_size");
					var imgAuto = $imgAuto[0];
					imgAuto.style.display = "none";
					imgAuto.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=img)";
					imgAuto.filters
							.item("DXImageTransform.Microsoft.AlphaImageLoader").src = img;
					// 延迟加载图片
					setTimeout(function() {
						var width = $imgAuto.width();
						var height = $imgAuto.height();
						// console.log(width);
						// console.log(height);
						privateFn.imgZoom($imgAuto, CONSTANT.FILTER, img);
					}, options.ie_delay);

				} else if (browserType == CONSTANT.BASE) {
					options.targetDiv.append(img);
					privateFn.imgZoom(img, CONSTANT.BASE);
				}
			},

			/**
			 * 图片显示方式
			 * 
			 * @param img
			 * @param browserType
			 * @param src
			 */
			imgZoom : function($img, browserType, src) {
				var options = $.fn.viewimg.options;
				// 支持html5浏览器下
				if (browserType == CONSTANT.HTML5) {
					// 完全
					if (options.sizingMethod == "img") {
						$img.show();
					}
					// 比例
					else if (options.sizingMethod == "scale") {
						publicFn.imgScale($img, options.targetDiv);
					}
					// 拉伸
					else if (options.sizingMethod == "stretch") {
						// 拉伸 code......
					}
				}
				// ie 7 8 9下
				else if (browserType == CONSTANT.FILTER) {
					// 完全显示
					if (options.sizingMethod == "img") {
						$img.show();
					}
					// 拉伸适应容器
					else if (options.sizingMethod == "stretch") {
						// $img[0].style.filter =
						// "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
					}
					// 保持比例适应容器
					else if (options.sizingMethod == "scale") {
						publicFn.imgScale($img, options.targetDiv, src);
					}
				}

				// ie 6 下
				else if (browserType == CONSTANT.BASE) {
					// 完全显示
					if (options.sizingMethod == "img") {
						$img.show();
					}
					// 拉伸适应容器
					else if (options.sizingMethod == "stretch") {
						$img.show();
					}
					// 保持比例适应容器
					else if (options.sizingMethod == "scale") {
						publicFn.imgScale($img, options.targetDiv);
					}
				}
				// 显示
				options.targetDiv.show();
			}
		};

		var method = arguments[0];
		var array;
		if (publicFn[method]) {
			method = publicFn[method];
			array = Array.prototype.slice.call(arguments, 1);
		} else if (typeof (method) == 'object' || !method) {
			method = privateFn.init;
			array = new Array(arguments[0]);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.viewimg');
			return this;
		}
		return this.each(function() {
			method.apply(this, array);
		});

	};

	// 公共方法
	var publicFn = {
		suportHTML5 : function() {
			if (window.File && window.FileReader && window.FileList
					&& window.Blob) {
				return CONSTANT.HTML5;
			} else if (typeof document.body.style.maxHeight === "undefined") {
				return CONSTANT.BASE;
			} else {
				return CONSTANT.FILTER;
			}
		},
		imgScale : function($img, $container, src) {
			var imgWidth = $img.width();
			var imgHeight = $img.height();
			var containerWidth = $container.width();
			var containerHeight = $container.height();
			// 图片比例
			var scale = imgWidth / imgHeight;

			// console.log("图片w:" +imgWidth);
			// console.log("图片h:" +imgHeight);
			// console.log("容器w:" +containerWidth);
			// console.log("容器h:" +containerHeight);
			// console.log("图片比例:" +scale);
			// 图片小于容器 居中显示
			if (imgWidth <= containerWidth & imgHeight <= containerHeight) {
				// console.log("居中显示");
			}
			// 宽度过长
			// 图片的宽度 大于 容器宽度 但是 高度小于等于 容器高度
			else if (imgWidth > containerWidth && imgHeight <= containerHeight) {
				imgWidth = containerWidth;
				imgHeight = imgWidth / scale;
				// console.log("缩放完成后比例:" + imgWidth/imgHeight);
			}
			// 高度过大
			// 图片的高度 大于 容器高度 但是 宽度小于等于 容器宽度
			else if (imgHeight > containerHeight && imgWidth <= containerWidth) {
				imgHeight = containerHeight;
				imgWidth = imgHeight * scale;
				// console.log("缩放完成后比例:" + imgWidth/imgHeight);
			}
			// 宽度高度 全部超出
			else if (imgHeight > containerHeight && imgWidth > containerWidth) {

				imgHeight = containerHeight;
				imgWidth = imgHeight * scale;
				// console.log("缩放完成后比例:" + imgWidth/imgHeight);
				if (imgWidth > containerWidth) {
					imgWidth = containerWidth;
					imgHeight = imgWidth / scale;
					// console.log("缩放完成后比例:" + imgWidth/imgHeight);
				}

			}
			var marginTop = (containerHeight - imgHeight) / 2;
			var marginLeft = (containerWidth - imgWidth) / 2;
			$img.width(imgWidth).height(imgHeight);

			if (src) {
				$img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				$img[0].filters
						.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
			}

			$img.css("margin-top", marginTop + "px");
			$img.css("margin-left", marginLeft + "px");
			$img.show();

		}
	};
	// 暴露默认设置
	$.fn.viewimg.options = {
		errorDiv : "",
		targetDiv : "", // 显示预览图片的位置
		allowTypes : [ ".jpg", ".png", ".bmp", ".gif", ".jpeg" ], // 允许上传图片类型
		sizingMethod : "img", // 图片展示方式
		// img 显示图片原始尺寸
		// stretch 拉伸适应容器
		// scale 比例适应外层容器
		ie_delay : 2000
	// 针对IE 78 的问题 图片过大的 需要延迟执行
	}

})(jQuery);