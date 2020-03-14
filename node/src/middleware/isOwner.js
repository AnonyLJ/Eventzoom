
// Used to determine if the request user owns the event or series
// Based on Hristos isAllowedToView middleware
const isOwner = (model, paramId, isValidated) => async (req, res, next) => {
	const param = isValidated ? req.validated[paramId] : req.params[paramId];
	const instance = await model.findById(param).populate();
	// not my problem if there's no instance
	if (!instance) {
		return next();
	}

	// Accommodates both events and series
	if (instance.organiser) {
		if (instance.organiser.equals(req.user._id)) {
			return next();
		}
	} else if (instance.user) {
		if (instance.user.equals(req.user._id)) {
			return next();
		}
	}


	return res.json({ success: false });
};

export default isOwner;