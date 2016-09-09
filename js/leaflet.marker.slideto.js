
// 🍂class Marker

L.Marker.include({

	_slideToUntil:    undefined,
	_slideToDuration: undefined,
	_slideToLatLng:   undefined,
	_slideFromLatLng: undefined,
	_slideKeepAtCenter: undefined,
	_slideDraggingWasAllowed: undefined,

	// 🍂method slideTo(latlng: LatLng, options: Slide Options): this
	// Moves this marker until `latlng`, like `setLatLng()`, but with a smooth
	// sliding animation. Fires `movestart` and `moveend` events.
	slideTo: function slideTo(latlng, options) {
		if (!this._map) return;

		this._slideToDuration = options.duration;
		this._slideToUntil    = performance.now() + options.duration;
		this._slideFromLatLng = this.getLatLng();
		this._slideToLatLng   = latlng;
		this._slideKeepAtCenter = !!options.keepAtCenter;
		this._slideDraggingWasAllowed =
			this._slideDraggingWasAllowed !== undefined ?
			this._slideDraggingWasAllowed :
			this._map.dragging.enabled();

		if (this._slideKeepAtCenter) {
			this._map.dragging.disable();
			this._map.options.touchZoom = 'center';
		}

		this.fire('movestart');
		this._slideTo();

		return this;
	},

	_slideTo: function _slideTo() {
		if (!this._map) return;

		var remaining = this._slideToUntil - performance.now();

		if (remaining < 0) {
			this.setLatLng(this._slideToLatLng);
			this.fire('moveend');
			if (this._slideDraggingWasAllowed ) {
				this._map.dragging.enable();
				this._map.options.touchZoom = true;
			}
			this._slideDraggingWasAllowed = undefined;
			return this;
		}

		var startPoint = this._map.latLngToContainerPoint(this._slideFromLatLng);
		var endPoint   = this._map.latLngToContainerPoint(this._slideToLatLng);
		var percentDone = (this._slideToDuration - remaining) / this._slideToDuration;

		var currPoint = endPoint.multiplyBy(percentDone).add(
			startPoint.multiplyBy(1 - percentDone)
		);
		var currLatLng = this._map.containerPointToLatLng(currPoint)
		this.setLatLng(currLatLng);

		if (this._slideKeepAtCenter) {
			this._map.panTo(currLatLng, {animate: false})
		}

		L.Util.requestAnimFrame(this._slideTo, this);
	}

});


/*
🍂miniclass Slide options (Marker)
🍂section

🍂option duration: Number = 1000
Duration of the sliding animation, in milliseconds.

🍂option keepAtCenter: Boolean = false
Whether the map center should be the marker's position during the sliding animation.
This disables the map dragging handler and touch zoom centering momentarily.

*/


// 🍂class CircleMarker
L.CircleMarker.include({
	// 🍂method slideTo(latlng: LatLng, options: Slide Options): this
	// Moves this circle until `latlng`, like `setLatLng()`, but with a smooth
	// sliding animation. Fires `movestart` and `moveend` events.
	slideTo: L.Marker.prototype.slideTo,
	_slideTo: L.Marker.prototype._slideTo
});