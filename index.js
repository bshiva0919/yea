const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

require('dotenv').config()
console.log(process.env)
console.log(process.env.DB_PASSWORD)
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "yea_api",
});



const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads/blogs', express.static(path.join(__dirname ,'uploads','blogs')));
app.use('/uploads/banners', express.static(path.join(__dirname ,'uploads','banners')));
app.use('/uploads/events', express.static(path.join(__dirname ,'uploads','events')));
app.use('/uploads/events/photos', express.static(path.join(__dirname ,'uploads','events','photos')));
app.use('/uploads/members', express.static(path.join(__dirname ,'uploads','members')));
app.use('/uploads/businesses', express.static(path.join(__dirname ,'uploads','businesses')));
app.use('/uploads', express.static(__dirname + '/uploads'))



app.post("/user/verify", (req, res) => {
  const query="select * from users where username = '" + req.body.username + "' and password = '" + req.body.password + "'";
  db.query(query, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});



app.get("/categories", (req, res) => {
  const q = "select * from categories";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});
app.post("/categories/create", (req, res) => {
  const q = `insert into categories(name)
    values(?)`;
  const values = [...Object.values(req.body)];
  console.log("insert", values);
  db.query(q, [values], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

app.get("/categories/category/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;
  const q = "SELECT * FROM categories where categoryID=?";
  db.query(q, [categoryID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});


app.put("/categories/update/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;
  console.log("updated " + req.body);
  const data = req.body;

  const q =
    "update categories set " +
    Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(",") +
    " where categoryID='" +
    categoryID +
    "'";
  console.log(q);
  db.query(q, [...Object.values(data)], (err, out) => {
    console.log(err, out);
    if (err) return res.json({ error: err.message });
    else {
      return res.json({ data: out });
    }
  });
});

app.delete("/categories/delete/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;
  const q = `DELETE FROM categories WHERE categoryID= ?`;
  db.query(q, [categoryID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else res.json({data})
  })
});


app.get("/blogs", (req, res) => {
  const q = "select * from blogs INNER JOIN categories ON blogs.categoryID = categories.categoryID order by blogs.blogID desc";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

const uploadBlogThumbstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadBlogThumb = multer({ storage: uploadBlogThumbstorage });

app.post("/blogs/thumbnailupload", uploadBlogThumb.single("thumbnailImage"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/blogs/create", (req, res) => {
    const q = `insert into blogs(title, blogType, categoryID, description, seo_title, seo_description, seo_keywords, thumbnailImage )
      values(?)`;
    const values = [...Object.values(req.body)];
    //console.log(values);
    console.log("insert", values);
    db.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.get("/blogs/:blogID", (req, res) => {
    const blogID = req.params.blogID;
    const q = "SELECT * FROM blogs join categories ON blogs.categoryID = categories.categoryID where blogs.blogID=?";
    db.query(q, [blogID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.put("/blogs/update/:blogID", (req, res) => {
    const id = req.params.blogID;
    console.log("updated " + req.body);
    const data = req.body;
    const q =
      "update blogs set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where blogID='" +
      id +
      "'";
    console.log(q);
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/blogs/delete/:blogID", (req, res) => {
    const blogID = req.params.blogID;
    const q = `DELETE FROM blogs WHERE blogID= ?`;
    db.query(q, [blogID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});


app.get("/banners", (req, res) => {
  const q = "select * from banners";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

const uploadBannerThumbstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banners/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadBannerThumb = multer({ storage: uploadBannerThumbstorage });

app.post("/banners/thumbnailupload", uploadBannerThumb.single("thumbnailImage"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/banners/create", (req, res) => {
    const q = `insert into banners(title, description, thumbnailImage )
      values(?)`;
    const values = [...Object.values(req.body)];
    //console.log(values);
    console.log("insert", values);
    db.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.get("/banners/:bannerID", (req, res) => {
    const bannerID = req.params.bannerID;
    const q = "SELECT * FROM banners where bannerID=?";
    db.query(q, [bannerID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.put("/banners/update/:bannerID", (req, res) => {
    const id = req.params.bannerID;
    console.log("updated " + req.body);
    const data = req.body;
    const q =
      "update banners set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where bannerID='" +
      id +
      "'";
    console.log(q);
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/banners/delete/:bannerID", (req, res) => {
    const bannerID = req.params.bannerID;
    const q = `DELETE FROM banners WHERE bannerID= ?`;
    db.query(q, [bannerID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});





app.get("/eventtypes", (req, res) => {
  const q = "select * from eventtypes";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});
app.post("/eventtypes/create", (req, res) => {
  const q = `insert into eventtypes(name)
    values(?)`;
  const values = [...Object.values(req.body)];
  console.log("insert", values);
  db.query(q, [values], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

app.get("/eventtypes/eventtype/:eventtypeID", (req, res) => {
  const eventtypeID = req.params.eventtypeID;
  const q = "SELECT * FROM eventtypes where eventtypeID=?";
  db.query(q, [eventtypeID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});


app.put("/eventtypes/update/:eventtypeID", (req, res) => {
  const eventtypeID = req.params.eventtypeID;
  console.log("updated " + req.body);
  const data = req.body;

  const q =
    "update eventtypes set " +
    Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(",") +
    " where eventtypeID='" +
    eventtypeID +
    "'";
  console.log(q);
  db.query(q, [...Object.values(data)], (err, out) => {
    console.log(err, out);
    if (err) return res.json({ error: err.message });
    else {
      return res.json({ data: out });
    }
  });
});

app.delete("/eventtypes/delete/:eventtypeID", (req, res) => {
  const eventtypeID = req.params.eventtypeID;
  const q = `DELETE FROM eventtypes WHERE eventtypeID= ?`;
  db.query(q, [eventtypeID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else res.json({data})
  })
});




app.get("/industries", (req, res) => {
  const q = "select * from industries";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});
app.post("/industries/create", (req, res) => {
  const q = `insert into industries(name)
    values(?)`;
  const values = [...Object.values(req.body)];
  console.log("insert", values);
  db.query(q, [values], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

app.get("/industries/industry/:industryID", (req, res) => {
  const industryID = req.params.industryID;
  const q = "SELECT * FROM industries where industryID=?";
  db.query(q, [industryID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});


app.put("/industries/update/:industryID", (req, res) => {
  const industryID = req.params.industryID;
  console.log("updated " + req.body);
  const data = req.body;

  const q =
    "update industries set " +
    Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(",") +
    " where industryID='" +
    industryID +
    "'";
  console.log(q);
  db.query(q, [...Object.values(data)], (err, out) => {
    console.log(err, out);
    if (err) return res.json({ error: err.message });
    else {
      return res.json({ data: out });
    }
  });
});

app.delete("/industries/delete/:industryID", (req, res) => {
  const industryID = req.params.industryID;
  const q = `DELETE FROM industries WHERE industryID= ?`;
  db.query(q, [industryID], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else res.json({data})
  })
});



app.get("/events", (req, res) => {
  const q = "select events.*,eventtypes.name as eventtypeName, industries.name as industryName from events JOIN eventtypes ON events.eventtypeID = eventtypes.eventtypeID JOIN industries ON events.industryID = industries.industryID order by events.eventID desc";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

const uploadEventThumbstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadEventThumb = multer({ storage: uploadEventThumbstorage });

app.post("/events/thumbnailupload", uploadEventThumb.single("thumbnailImage"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/events/create", (req, res) => {
    const q = `insert into events(title, eventtypeID, industryID, start_date, end_date, description, eventStatus, seo_title, seo_description, seo_keywords, thumbnailImage )
      values(?)`;
    const values = [...Object.values(req.body)];
    //console.log(values);
    console.log("insert", values);
    db.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.get("/events/:eventID", (req, res) => {
    const eventID = req.params.eventID;
    const q = "select events.*,eventtypes.name as eventtypeName, industries.name as industryName from events JOIN eventtypes ON events.eventtypeID = eventtypes.eventtypeID JOIN industries ON events.industryID = industries.industryID where events.eventID=?";
    db.query(q, [eventID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.put("/events/update/:eventID", (req, res) => {
    const id = req.params.eventID;
    console.log("updated " + req.body);
    const data = req.body;
    const q =
      "update events set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where eventID='" +
      id +
      "'";
    console.log(q);
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/events/delete/:eventID", (req, res) => {
    const eventID = req.params.eventID;
    const q = `DELETE FROM events WHERE eventID= ?`;
    db.query(q, [eventID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});



app.get("/eventphotos", (req, res) => {
  const q = "select * from eventphotos order by eventphotoID desc";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

const uploadEventPhotostorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events/photos/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadEventPhoto = multer({ storage: uploadEventPhotostorage });

app.post("/eventphotos/thumbnailupload", uploadEventPhoto.single("photo"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/eventphotos/create", (req, res) => {
    const q = `insert into eventphotos(eventID, photo )
      values(?)`;
    const values = [...Object.values(req.body)];
    //console.log(values);
    console.log("insert", values);
    db.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });


  
  app.delete("/eventphotos/delete/:eventphotoID", (req, res) => {
    const eventphotoID = req.params.eventphotoID;
    const q = `DELETE FROM eventphotos WHERE eventphotoID= ?`;
    db.query(q, [eventphotoID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});



app.get("/members", (req, res) => {
  const q = "select * from members order by memberID";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

app.get("/members/membersbymembertype", (req, res) => {

  const memberType = req.query.membertype;
  let sql = "select * from members where memberType = '" + memberType + "' order by memberID";
   
  db.query(sql, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});


app.post("/member/verify", (req, res) => {
  const query="select * from members where email = '" + req.body.email + "' and password = '" + req.body.password + "'";
  db.query(query, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

const uploadMemberThumbstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/members/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadMemberThumb = multer({ storage: uploadMemberThumbstorage });

app.post("/members/thumbnailupload", uploadMemberThumb.single("profileImage"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/members/create",  async (req, res) => {
      const data={
        full_name: req.body.full_name, designation: req.body.designation, company_name: req.body.company_name, memberType: req.body.memberType, email: req.body.email, password: req.body.password, phone: req.body.phone, profileImage: req.body.profileImage, address: req.body.address, city: req.body.city, state: req.body.state, postal_code: req.body.postal_code, about_notes: req.body.about_notes, facebook_profile_URL:req.body.facebook_profile_URL, twitter_profile_URL: req.body.twitter_profile_URL, linkedin_profile_URL: req.body.linkedin_profile_URL, instagram_profile_URL: req.body.instagram_profile_URL      };
      let sql="INSERT INTO `members` SET ?";
    db.query(sql,data, (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.get("/members/:memberID", (req, res) => {
    const memberID = req.params.memberID;
    const q = "SELECT * FROM members where memberID=?";
    db.query(q, [memberID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.put("/members/update/:memberID", (req, res) => {
    const id = req.params.memberID;
    console.log("updated " + req.body);
    const data = req.body;
    const q =
      "update members set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where memberID='" +
      id +
      "'";
    console.log(q);
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/members/delete/:memberID", (req, res) => {
    const memberID = req.params.memberID;
    const q = `DELETE FROM members WHERE memberID= ?`;
    db.query(q, [memberID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});



app.get("/businesses", (req, res) => {
  const q = "select * from businesses order by businessID desc";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});


app.get("/businesses/member/:memberID", (req, res) => {
  const memberID = req.params.memberID;
  const q = "select * from businesses where memberID = " + memberID + " order by businessID desc";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});



const uploadBusinessThumbstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/businesses/");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
  },
});

const uploadBusinessThumb = multer({ storage: uploadBusinessThumbstorage });

app.post("/businesses/thumbnailupload", uploadBusinessThumb.single("thumbnailImage"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

  app.post("/businesses/create",  async (req, res) => {
    const data = req.body;
    const sql = 'insert into businesses (' +
    Object.keys(data)
      .map((k) => `${k}`)
      .join(",") + ') values (?)';
  const values = [...Object.values(req.body)];

    db.query(sql,[values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.get("/businesses/:businessID", (req, res) => {
    const businessID = req.params.businessID;
    const q = "SELECT * FROM businesses JOIN industries ON businesses.industryID = industries.industryID where businessID=?";
    db.query(q, [businessID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });
  
  app.put("/businesses/update/:businessID", (req, res) => {
    const id = req.params.businessID;
    console.log("updated " + req.body);
    const data = req.body;
    const q =
      "update businesses set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where businessID='" +
      id +
      "'";
    console.log(q);
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/businesses/delete/:businessID", (req, res) => {
    const businessID = req.params.businessID;
    const q = `DELETE FROM businesses WHERE businessID= ?`;
    db.query(q, [businessID], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});




app.listen(8081, () => {
  console.log("listening");
});
