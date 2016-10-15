function Slider(triggers, sliderContainer, navButtons){
	this.controlsPoint = document.querySelector(triggers);

	if(!this.controlsPoint){
		return;
	}

	this.controlsPoint.addEventListener("click", this.handler.bind(this));
	this.imgsContainer = document.querySelector(sliderContainer);
	this.positionItem = 1;
	this.widthImg = window.getComputedStyle(this.imgsContainer.children[0]).getPropertyValue("width").slice(0,-2);
	this.navButtons = document.querySelector(navButtons);
	this.navButtons.addEventListener("click", this.nextPrevButton.bind(this));
	this.slidesCount = this.imgsContainer.children.length;
	this.timerId;
	this.autoDirection = true;//true = right, false = left
	this.sliderAutoScroll();
}

Slider.prototype.handler = function(e) {
    var target = e && e.target ? e.target : this.controlsPoint;

    if(!target.classList.contains("slider-trigger")){
        return;
    }

	clearInterval(this.timerId);

	this.setAllInactive();

    target.classList.add("slider-trigger-active");
	var dataPoint = target.getAttribute("data-point");

	this.slideTranslation(dataPoint);
	this.sliderAutoScroll();
}

Slider.prototype.slideTranslation = function (dataPoint) {
	if (dataPoint < this.positionItem){
		this.imgsContainer.style.transform = "translateX("+ this.widthImg*(-(this.positionItem - 1) + (this.positionItem - dataPoint))+"px)";
	}
	else{
		this.imgsContainer.style.transform = "translateX("+-this.widthImg*(dataPoint-1)+"px)";
	}
	this.positionItem = dataPoint;
}

Slider.prototype.nextPrevButton = function(e){
	var target = e && e.target ? e.target : this.navButtons;

	if(!target.hasAttribute("data-btn")){
		return;
	}

	var direction = target.getAttribute("data-btn");

	clearInterval(this.timerId);

	if(direction == "right" && this.positionItem == this.slidesCount) {
		this.positionItem = 0;
	}
	if(direction == "left" && this.positionItem == 1){
		this.positionItem = this.slidesCount + 1;
	}

	if (direction == "right" && this.positionItem < this.slidesCount){
		this.slideTranslation(1*this.positionItem + 1);
	}
	else if(direction == "left" && this.positionItem > 1){
		this.slideTranslation(1*this.positionItem - 1);
	}

	this.setActiveDataPoint();
	this.sliderAutoScroll();
}

Slider.prototype.setActiveDataPoint = function(){
	this.setAllInactive();
	this.controlsPoint.children[this.positionItem - 1].classList.add("slider-trigger-active");
}

Slider.prototype.setAllInactive = function(){
    for (var i = 0; i < this.controlsPoint.children.length; i++){
        this.controlsPoint.children[i].classList.remove("slider-trigger-active");
    }
}

Slider.prototype.sliderAutoScroll = function(){
	var self = this;

	this.timerId = setInterval(function(){
		if(self.positionItem == self.slidesCount) {
			self.autoDirection = false;
		}
		else if(self.positionItem == 1){
			self.autoDirection = true;
		}

		if (self.autoDirection && self.positionItem < self.slidesCount){
			self.slideTranslation(1*self.positionItem + 1);
		}
		else if(!self.autoDirection && self.positionItem > 1){
			self.slideTranslation(1*self.positionItem - 1);
		}

		self.setActiveDataPoint();
	},4000)
}
