import statusCode from '../enum/statusCode';
import AnauthorizedException from '../exception/Anauthorized';
import { AuthService } from '../service/auth/auth..service';
import ForbiddenException from '../exception/Forbidden';
const nonSecurePaths = ['/', '/auth/register', '/auth/login', '/auth/logout'];
function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}
export const checkAuthGuard = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);
    if ((cookies && cookies.access_token) || tokenFromHeader) {
        let token = cookies && cookies.access_token ? cookies?.access_token : tokenFromHeader;
        // giải mã token
        let decode = AuthService.verifyToken(token);
        console.log('<<<<<<< decode >>>>>>>', decode);
        if (decode) {
            req.user = decode;
            next();
        }
        throw new AnauthorizedException(statusCode['UNAUTHORIZED'], 'Unauthorized', 'Bạn chưa đăng nhập.Vui lòng đăng nhập!')

    } else {
        throw new AnauthorizedException(statusCode['UNAUTHORIZED'], 'Unauthorized', 'Bạn chưa đăng nhập.Vui lòng đăng nhập!')
    }

}
export const checkAuthGuardPermission = (req, res, next) => {
    if (req.path.startsWith('/auth')) return next();
    if (req.user) {
        let email = req.user?.email;
        let roles = req.user?.roles.Roles;
        let currentPath = req.path;
        if (!roles || roles.length === 0) {
            throw new ForbiddenException(statusCode['FORBIDDEN'], 'Forbidden', 'Bạn không có quyền truy cập!');
        }
        let canAcess = roles.some(item => item.url === currentPath);
        if (canAcess === true) {
            next();
        } else {
            throw new ForbiddenException(statusCode['FORBIDDEN'], 'Forbidden', 'Bạn không có quyền truy cập!')
        }
    } else {
        throw new AnauthorizedException(statusCode['UNAUTHORIZED'], 'Unauthorized', 'Bạn chưa đăng nhập.Vui lòng đăng nhập!')
    }
}