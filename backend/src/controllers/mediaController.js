const db = require("../config/db");

exports.getMedia=(req,res)=>{

    const sql = `
    SELECT m.*, g.nombre genero, d.nombres director,
    p.nombre productora, t.nombre tipo
    FROM media m
    JOIN genero g ON m.genero_id=g.id
    JOIN director d ON m.director_id=d.id
    JOIN productora p ON m.productora_id=p.id
    JOIN tipo t ON m.tipo_id=t.id`;

    db.query(sql,(err,result)=>{
        if(err) res.send(err);
        else res.json(result);
    });

};

exports.createMedia=(req,res)=>{

    const {
        serial,
        titulo,
        sinopsis,
        url,
        imagen,
        anio_estreno,
        genero_id,
        director_id,
        productora_id,
        tipo_id
    } = req.body;

    const sql=`
    INSERT INTO media
    (serial,titulo,sinopsis,url,imagen,anio_estreno,genero_id,director_id,productora_id,tipo_id)
    VALUES (?,?,?,?,?,?,?,?,?,?)`;

    db.query(sql,
        [
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anio_estreno,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        ],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Media creada");
        }
    );
};

exports.updateMedia=(req,res)=>{
    const {id}=req.params;

    const {
        titulo,
        sinopsis,
        url,
        imagen,
        anio_estreno
    } = req.body;

    db.query(
        `UPDATE media 
        SET titulo=?,sinopsis=?,url=?,imagen=?,anio_estreno=?
        WHERE id=?`,
        [titulo,sinopsis,url,imagen,anio_estreno,id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Media actualizada");
        }
    );
};

exports.deleteMedia=(req,res)=>{
    const {id}=req.params;

    db.query(
        "DELETE FROM media WHERE id=?",
        [id],
        (err,result)=>{
            if(err) res.send(err);
            else res.send("Media eliminada");
        }
    );
};