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

import differencesNode from "./differences-node";
import helper from "node-red-node-test-helper";
import { expect } from "chai";

helper.init(require.resolve("node-red"));

describe("The Differences Node", function () {
  // beforeEach(function (done) {
  //   helper.startServer(done);
  // });

  afterEach(function (done) {
    helper.unload();
    done();
    // helper.stopServer(done);
  });

  const flow = [
    {
      id: "n1",
      type: "differences",
      leftInput: "left",
      leftInputType: "msg",
      rightInput: "right",
      rightInputType: "msg",
      func: "-",
      outputType: "msg",
      output: "payload",
      wires: [["n2"]],
    },
    { id: "n2", type: "helper" },
  ];

  it("should be loaded", function (done) {
    helper.load(differencesNode, flow, function () {
      try {
        const n1 = helper.getNode("n1");
        expect(n1.type).to.equal("differences");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("should output complement", function (done) {
    flow[0].func = "-";
    helper.load(differencesNode, flow, function () {
      try {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");

        n2.on("input", function (msg: any) {
          try {
            console.log("GETTING INPUT");
            expect(msg.payload).to.deep.equal(["left"]);
            done();
          } catch (err) {
            done(err);
          }
        });

        n1.receive({ payload: "whatever", left: ["left"], right: ["right"] });
      } catch (err) {
        done(err);
      }
    });
  });

  it("should output intersection", function (done) {
    flow[0].func = "⋂";
    helper.load(differencesNode, flow, function () {
      try {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");

        n2.on("input", function (msg: any) {
          try {
            console.log("GETTING INPUT");
            expect(msg.payload).to.deep.equal(["left"]);
            done();
          } catch (err) {
            done(err);
          }
        });

        n1.receive({
          payload: "whatever",
          left: ["left"],
          right: ["right", "left"],
        });
      } catch (err) {
        done(err);
      }
    });
  });

  it("should output union", function (done) {
    flow[0].func = "⋃";
    helper.load(differencesNode, flow, function () {
      try {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");

        n2.on("input", function (msg: any) {
          try {
            expect(msg.payload).to.deep.equal(["left", "right"]);
            done();
          } catch (err) {
            done(err);
          }
        });

        n1.receive({
          payload: "whatever",
          left: ["left"],
          right: ["right", "left"],
        });
      } catch (err) {
        done(err);
      }
    });
  });
});
