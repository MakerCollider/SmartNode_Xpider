/**
 * Copyright 2013, 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var cron = require("cron");

    function cateinjectNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.catename = n.catename;
        this.payload = n.payload;
        var node = this;

        this.on("input",function(msg) {
            try {
                var data = {};
                data[this.catename] = this.payload;
                msg.payload = data;
                msg.save = true;
                msg.category_name = this.catename;
                msg.category = this.payload;
                this.send(msg);
                msg = null;
            } catch(err) {
                this.error(err,msg);
            }
        });
    }

    RED.nodes.registerType("cateinject",cateinjectNode);


    RED.httpAdmin.post("/cateinject/:id", RED.auth.needsPermission("cateinject.write"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("cateinject.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });
}
