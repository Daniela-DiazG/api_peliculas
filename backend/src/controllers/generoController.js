const db = require("../config/db");

exports.getGeneros = (req,res)=>{
    db.query("SELECT * FROM genero",(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });
};

exports.getGenero = (req,res)=>{
    const {id}=req.params;
    db.query("SELECT * FROM genero WHERE id=?",[id],(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });
};

exports.createGenero = (req,res)=>{
    const {nombre,descripcion}=req.body;
    db.query(
        "INSERT INTO genero (nombre,descripcion) VALUES (?,?)",
        [nombre,descripcion],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Genero creado");
        }
    );
};

exports.updateGenero = (req,res)=>{
    const {id}=req.params;
    const {nombre,descripcion,estado}=req.body;

    db.query(
        "UPDATE genero SET nombre=?,descripcion=?,estado=? WHERE id=?",
        [nombre,descripcion,estado,id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Genero actualizado");
        }
    );
};

exports.deleteGenero = (req,res)=>{
    const {id}=req.params;

    db.query("DELETE FROM genero WHERE id=?",[id],(err,result)=>{
        if(err) res.send(err);
        else res.send("Genero eliminado");
    });
};