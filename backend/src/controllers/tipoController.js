const db = require("../config/db");

exports.getTipos=(req,res)=>{
    db.query("SELECT * FROM tipo",(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });
};

exports.createTipo=(req,res)=>{
    const {nombre,descripcion}=req.body;

    db.query(
        "INSERT INTO tipo (nombre,descripcion) VALUES (?,?)",
        [nombre,descripcion],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Tipo creado");
        }
    );
};

exports.updateTipo=(req,res)=>{
    const {id}=req.params;
    const {nombre,descripcion}=req.body;

    db.query(
        "UPDATE tipo SET nombre=?,descripcion=? WHERE id=?",
        [nombre,descripcion,id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Tipo actualizado");
        }
    );
};

exports.deleteTipo=(req,res)=>{
    const {id}=req.params;

    db.query(
        "DELETE FROM tipo WHERE id=?",
        [id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Tipo eliminado");
        }
    );
};