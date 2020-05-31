/* 
========================================================================= 
Copyright 2020 T-Mobile USA, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
See the LICENSE file for additional language around the disclaimer of warranties. Trademark Disclaimer: Neither the name of "T-Mobile, USA" nor the names of
its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 
================================
*/

import { Red, Node, NodeProperties } from "node-red";

export default function differencesNode(RED: Red) {
  function DifferencesNode(config: NodeProperties & { [key: string]: any }) {
    RED.nodes.createNode(this, config);

    const node = this as Node;
    // const context = this.context();

    this.leftInput = config.leftInput || "payload";
    this.leftInputType = config.leftInputType || "msg";

    this.rightInput = config.rightInput || "payload";
    this.rightInputType = config.rightInputType || "msg";

    console.log("DifferencesNode, constructor", config);

    node.on("input", function (msg, send) {
      const leftInputValue = RED.util.evaluateNodeProperty(
        this.leftInput, // "payload", "widgets", "gadgets", etc.
        this.leftInputType, // "msg", "flow", "global"
        node,
        msg
      );

      const rightInputValue = RED.util.evaluateNodeProperty(
        this.rightInput, // "payload", "widgets", "gadgets", etc.
        this.rightInputType, // "msg", "flow", "global"
        node,
        msg
      );

      console.log("Left Input!", leftInputValue);
      console.log("Right Input!", rightInputValue);

      send(msg);
    });
  }

  RED.nodes.registerType("differences", DifferencesNode);
}

module.exports = differencesNode;

// Differences Node Input:
//  Left Input: [list | object]
//  Right Input: [list | object]
//  Output Type: [ Union | Intersection | Left-Complement | Right-Complement ]
