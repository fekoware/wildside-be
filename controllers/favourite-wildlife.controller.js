const { fetchWildlifeByUserId} = require("../models/favourite-wildlife.model")

exports.getWIldlifeByUserId = (request, response, next) => {

    console.log("inside controller")
        const {user_id} = request.params;
        console.log(user_id)

        fetchWildlifeByUserId(user_id).then((wildlife)=> {
            response.status(200).send({wildlife})
            console.log(wildlife)
        }).catch(next)
    
}
