const db = require("../config/db");

exports.getProductoras=(req,res)=>{
    db.query("SELECT * FROM productora",(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });
};

exports.createProductora=(req,res)=>{
    const {nombre,slogan,descripcion}=req.body;

    db.query(
        "INSERT INTO productora (nombre,slogan,descripcion) VALUES (?,?,?)",
        [nombre,slogan,descripcion],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Productora creada");
        }
    );
};

exports.updateProductora=(req,res)=>{
    const {id}=req.params;
    const {nombre,slogan,descripcion,estado}=req.body;

    db.query(
        "UPDATE productora SET nombre=?,slogan=?,descripcion=?,estado=? WHERE id=?",
        [nombre,slogan,descripcion,estado,id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Productora actualizada");
        }
    );
};

exports.deleteProductora=(req,res)=>{
    const {id}=req.params;

    db.query(
        "DELETE FROM productora WHERE id=?",
        [id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Productora eliminada");
        }
    );
};