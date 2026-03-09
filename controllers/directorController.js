const db = require("../config/db");

exports.getDirectores=(req,res)=>{
    db.query("SELECT * FROM director",(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });
};

exports.createDirector=(req,res)=>{
    const {nombres}=req.body;

    db.query(
        "INSERT INTO director (nombres) VALUES (?)",
        [nombres],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Director creado");
        }
    );
};

exports.updateDirector=(req,res)=>{
    const {id}=req.params;
    const {nombres,estado}=req.body;

    db.query(
        "UPDATE director SET nombres=?,estado=? WHERE id=?",
        [nombres,estado,id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Director actualizado");
        }
    );
};

exports.deleteDirector=(req,res)=>{
    const {id}=req.params;

    db.query(
        "DELETE FROM director WHERE id=?",
        [id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Director eliminado");
        }
    );
};