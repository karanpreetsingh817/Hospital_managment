class Features{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    };

    filter(){
        const queryobj = { ...this.queryString };
        //  exclude these keywords bcz we write each of method differently
        const excludequery = ["page", "sort", "limit", "fields"];
        excludequery.forEach((el) => {
            delete queryobj[el];
        });
        // ADVANCED FILTERING THE RESULT
        let queryStr = JSON.stringify(queryobj);
        queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (ele) => {
            return `$${ele}`;
        });
        this.query.find(JSON.parse(queryStr)); // this will return us a query object whi
        return this;
    }


    sort(){
        this.query.sort('-dateOfCreation');
        return this
    }

    fieldlimits(){
        if(this.queryString.fields){
            let fieldLimits=this.queryString.fields.split(',').join(' ');
            this.query.select(fieldLimits);
        }
        else{
            this.query.select('name age address bloodGroup phoneNumber photo -_id');
        }
         return this
    }

    pagination(){
        const page=this.queryString.page*1 || 1;
        const limit=this.queryString.limit*1 || 3;
        const skip=(page-1)*limit;
        this.query.skip(skip).limit(limit);
        return this
    }
}

module.exports=Features;