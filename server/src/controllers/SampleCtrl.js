'use strict'
class SampleCtrl {
  getList(req, res, next){

    // const User = mongoose.model('users');
    //
    // User.create({
    //   _id: '3002a825-0667-4be4-a2fa-bfe36022a861',
    //   email:'naveen1@gmail.com',
    //   firstName:'naveen14'}).then(()=>{
    //     console.log('Temp Users Created');
    //   }).catch((error)=>{
    //     console.log('Hello'+error);
    //   });
    console.log(1234);
    console.log(req.userId);
    res.status(200).send("Im am getList() from SampleCtrl");
    req.log.debug("hello data");
    //return next(new errs.InvalidArgumentError("I just don't like you"));
    return next();
  }
}

module.exports = SampleCtrl;
