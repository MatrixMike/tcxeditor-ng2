import {TCXData, Laps, Lap } from './interfaces';

/* getLapTime/Distance should really use last point of previous lap to calculate
 */
var getLapTime = function(lap) {
  var begin = new Date(lap.Track[0].Trackpoint[0].Time[0]);
  var end = new Date(lap.Track[0].Trackpoint[lap.Track[0].Trackpoint.length-1].Time[0]);
  return (end.valueOf() - begin.valueOf()) / 1000;
};

var getLapDistance = function(lap) {
  var begin = parseInt(lap.Track[0].Trackpoint[0].DistanceMeters[0]);
  var end = parseInt(lap.Track[0].Trackpoint[lap.Track[0].Trackpoint.length-1].DistanceMeters[0]);
  return (end - begin);
};

export var getTrackpoints = function(lapsData) {
	return lapsData.map(lap =>
		lap.Track[0].Trackpoint.map(tp => ({
			timestamp: tp.Time[0],
			distance: parseFloat(tp.DistanceMeters[0]),
			selected: false,
			lat: parseFloat(tp.Position[0].LatitudeDegrees[0]),
			lng: parseFloat(tp.Position[0].LongitudeDegrees[0])
		}) )
	);
};

export var getSummaryData = function(lapsData) {
	return lapsData.map(lap => {
		let tps = lap.Track[0].Trackpoint;
		let avgSpeed;
		if (lap.Extensions[0]['LX']) {
			avgSpeed = lap.Extensions[0].LX[0].AvgSpeed[0]
		} else if (lap.Extensions[0]['ns3:LX']) {
			avgSpeed = lap.Extensions[0]["ns3:LX"][0]['ns3:AvgSpeed'][0]
		}
		return {
			startTime: new Date(tps[0].Time[0]),
			endTime: new Date (tps[tps.length - 1].Time[0]),
			time: parseFloat(lap.TotalTimeSeconds[0]),
			estTime: getLapTime(lap),
			distance: lap.DistanceMeters[0],
			estDist: getLapDistance(lap),
			maxSpeed: lap.MaximumSpeed[0],
			avgSpeed: parseFloat(avgSpeed)
		};
	});
};

// Tested
export var getLapsToChange = function(selectedTps) {
	return Object.keys(selectedTps)
		.filter( lapKey => Object.keys(selectedTps[lapKey]).some( k => selectedTps[lapKey][k] ) )
		.map( x => parseInt(x) )
		.sort( (r1,r2) => r2 - r1 );
};

export var deletePoints = function(rawData:Laps, selectedTps) {

	let deletingFromStart =
		selectedTps.hasOwnProperty(0)      // selected has a key '0'
		&& selectedTps[0].hasOwnProperty(0)   // that object as a key '0'
		&& selectedTps[0][0]; 				// and first point marked for deletion

	// get the laps that will be changed
	// Work backwards through laps to avoid issues when we can delete a lap
	let lapsToChange = getLapsToChange(selectedTps);

	lapsToChange.forEach(lapIndex => {
		let startTps = rawData[lapIndex].Track[0].Trackpoint;
		// filter and keep those where selectedTps = null or false
		let filteredTps = startTps.filter( (e,i) => !selectedTps[lapIndex][i] );
        console.log('Filtering reduced tps from %s to %s', startTps.length, filteredTps.length);

		// If all lap points deleted, then remove lap
		if (!filteredTps.length) {
			console.log('removing lap', lapIndex);
			rawData.splice(lapIndex,1);
		} else {
			// reset summary info
			rawData[lapIndex].Track[0].Trackpoint = filteredTps;
			// Reset laptime, lapdistance, avergae speed
			let lapTime = getLapTime(rawData[lapIndex]);
			let lapdistance = getLapDistance(rawData[lapIndex]);
			rawData[lapIndex].TotalTimeSeconds[0] = lapTime;
			rawData[lapIndex].DistanceMeters[0] = lapdistance;
			rawData[lapIndex].Extensions[0].LX[0].AvgSpeed[0] =
                    lapdistance / lapTime;
		}
	});

	// if deleting from start, then reset distances along entire route
	if (deletingFromStart) {
		let startDist =
			parseFloat(rawData[0].Track[0].Trackpoint[0].DistanceMeters[0]);

		rawData.map(lap => {
			lap.Track[0].Trackpoint = lap.Track[0].Trackpoint.map( tp => {
				tp.DistanceMeters[0] = (parseFloat(tp.DistanceMeters[0]) - startDist).toString();
				return tp;
			});
			return lap;
		});
	}

	return rawData;
};

export var findClosest = function(laps: Laps, point) {
	var plat, plng, res;

	plat = point.lat();
	plng = point.lng();
	// console.log(`findClosest: ${plat}, ${plng}`);

	res = laps.reduce( (lapAcc, lap, lapCount) => {
		// get shortest distance for this lap
		var thisLap = lap.Track[0].Trackpoint.reduce( (acc, elem, idx) => {
			var dist, lat, lng;
			if (elem.Position) {
				lat = parseFloat(elem.Position[0].LatitudeDegrees[0]);
				lng = parseFloat(elem.Position[0].LongitudeDegrees[0]);
				dist = Math.pow(plat - lat, 2) + Math.pow(plng - lng, 2);

				if (dist < acc[1]) {
					// console.log(idx, "New closest", dist)
					return [idx, dist];
				} else {
					// console.log(idx, "Not closer", dist)
					return acc;
				}
			} else return acc;
		}, [0, lapAcc[2]]);
		// console.log("thisLap", thisLap);

		// compare this with best so far
		if (thisLap[1] < lapAcc[2]) {
			// i.e. return [lap, index in lap, dist]
			// return [lapCount].concat(thisLap);
			return [lapCount, ...thisLap];
		} else {
			return lapAcc;
		}
	}, [0, 0, Infinity]);

	// we do not need the distance value
	return res.slice(0, -1);
};

export var Private = {
	getLapsToChange: getLapsToChange
};

