import jwt from "jsonwebtoken"
import authConfig from '../config/jwt.js'

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error:'Token não informa'});
    }

    const [scheme, token] = authHeader.split(' ');

    if(scheme !== 'Bearer' || !token){
        return res.status(401).json({error:'Token mal farmatado'})
    }

    try {
        const decod = jwt.verify(token,authConfig.jwt.secret);
        req.user = {
            id:decod.id,
            email: decod.email,
            role: decod.role
        };

        const method = req.method;
        const path = req.path;

        console.log(`Middleware de autenticação: ${method} /// ${path} - Usuários: ${req.user.email} (Role: ${req.user.role})`);
        if(path.startsWith('/usuarios') && req.user.role !== 'admin'){
            return res.status(403).json({error: 'Acesso negado: apenas administradores podem acessar esta rota'})
        }

        return next()
    } catch (error) {
        return res.status(401).json({error:'Token inválido ou expirado'})
    }
}

export default authMiddleware