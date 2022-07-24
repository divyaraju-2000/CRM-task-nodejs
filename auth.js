

export default function auth(request,response,next){
    try{
        const token =request.header("x-auth-token");
        console.log("webtolen",token)
        jwt.verify(token,secret_key);
        next();
    }
        catch(err){
            response.send({"error":err.message});
        }

    
}