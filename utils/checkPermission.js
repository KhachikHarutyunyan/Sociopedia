import {UnauthenticatedError} from "../errors/index.js";

const checkPermissions = (requestUser, resourseUserId) => {
    if (requestUser.userId === resourseUserId.toString()) return;

    throw new UnauthenticatedError("Not authorize to access this route");
}

export default checkPermissions;