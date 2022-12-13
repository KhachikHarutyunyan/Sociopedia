import {UnauthorizedError} from "../errors/index.js";

const checkPermissions = (requestUser, resourseUserId) => {
    if (requestUser.userId === resourseUserId.toString()) return;

    throw new UnauthorizedError("Unauthorized to access this route");
}

export default checkPermissions;