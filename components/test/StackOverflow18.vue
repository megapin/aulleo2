<script setup>
definePageMeta({layout: false})

const au = useAuStore()
const c = useRuntimeConfig()

au.account = await $fetch('/api/account')
const res = await $fetch(c.public.upbit+'/ticker/all', {query: {quote_currencies: 'KRW'}})

onMounted(() => {
	// https://stackoverflow.com/questions/43545815/html5-canvas-smooth-text-movement-animation-impossible
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var scale = devicePixelRatio *2;
	canvas.width = window.innerWidth // canvas.width *= scale;
	canvas.height = window.innerHeight // canvas.height *= scale;

	function initTextsSprites(texts, radius, padding, bgColor, textColor, shadowColor) {
		// create an offscreen canvas which will be used as a spritesheet
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		radius *= scale;
		padding *= scale;
		
		var d = radius * 2;

		var cw = (d + (padding * 2));
		canvas.width = cw * texts.length;
		canvas.height = d * 2 + padding * 2;

		var topAlignText = 6 * scale; // just because I don't trust textBaseline
		var y;

		//  drawCircles
		ctx.fillStyle = bgColor;
		// ctx.shadowOffsetX = ctx.shadowOffsetY = 2;
		// ctx.shadowBlur = 6;
		// ctx.shadowColor = shadowColor;
		y = (radius * 2) + padding;
		// ctx.beginPath();
		texts.forEach(function(t, i) {
			var cx = cw * i + padding * 2;
			ctx.moveTo(cx + radius, y)
			// ctx.arc(cx, y, radius, 0, Math.PI * 2);
			ctx.arc(cx, y+21, radius*1.60, 0, Math.PI * 2);

			// ctx.fillRect(cw * i, y-20, 110, 85)
		})
		ctx.fill();

		// signed_change_rate
		ctx.textAlign = "center";
		ctx.font = "bold "+(16 * scale)+"px Helvetica";
		// ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
		y = padding + topAlignText + 90
		texts.forEach(function(txt, i) {
			txt.width = ctx.measureText(txt).width
			var cx = cw * i + padding * 2;
	ctx.fillStyle = txt.signed_change_rate > 0 ? 'red' : 'blue'
			// ctx.fillText(i, cx, y);
			ctx.fillText((txt.signed_change_rate*100).toFixed(2), cx, y);
		});

		// market
		// ctx.fillStyle = 'white';
		var cy = (radius * 2) + padding + topAlignText;
		// const cy = (radius * 1) + padding + topAlignText;
		texts.forEach(function(txt, i) {
			var cx = cw * i + padding * 2;
	ctx.font = "bold "+(21)+"px Helvetica";
	ctx.fillStyle = txt.signed_change_rate > 0 ? 'red' : 'blue'
	// ctx.font = "bold "+(16 * txt.change_rate*100)+"px Helvetica";
			// ctx.fillText(txt, cx, cy);
			ctx.fillText(txt.market.slice(4), cx, cy);
		});

		return function(index, x, y, w, h) {
			if (!w) { w = cw }
			if (!h) { h = canvas.height }
			// return an Array that we will able to apply on drawImage
			return [canvas,
				index * cw, 0, cw, canvas.height, // source
				x, y, w, h // destination
			]
		}
	}

	const texts = res
	var getTextSprite = initTextsSprites(texts, 15, 12, "lightgray", "white", "rgba(0, 0, 0, 0.4)");
	// just to make them move independently
	var objs = texts.map(txt => ({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		speedX: Math.random() - .5,
		speedY: Math.random() - .5,
		update: function() {
			this.x += this.speedX;
			this.y += this.speedY;
			if (this.x < 0) {
				this.speedX *= -1;
				this.x = 0;
			}
			if (this.y < 0) {
				this.speedY *= -1;
				this.y = 0;
			}
			if (this.x > canvas.width) {
				this.speedX *= -1;
				this.x = canvas.width;
			}
			if (this.y > canvas.height) {
				this.speedY *= -1;
				this.y = canvas.height;
			}
		}
	}))

	function anim() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		objs.forEach((o, i) => {
			o.update()
			ctx.drawImage.apply(ctx, getTextSprite(i, o.x, o.y))
		})
		requestAnimationFrame(anim);
	}
	anim();
})
</script>

<template>
	<canvas id="canvas" class="bg-gray"></canvas>
</template>
