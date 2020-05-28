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

import arrayDiffer from "./array-differ";
import helper from "node-red-node-test-helper";
import { expect } from "chai";

helper.init(require.resolve("node-red"));

describe("array-differ Node", function () {
  // beforeEach(function (done) {
  //   helper.startServer(done);
  // });

  afterEach(function (done) {
    helper.unload();
    done();
    // helper.stopServer(done);
  });

  it("should be loaded", function (done) {
    const flow = [{ id: "n1", type: "array-differ", name: "test name" }];
    helper.load(arrayDiffer, flow, function () {
      const n1 = helper.getNode("n1");
      expect(n1.name).to.equal("test name");
      done();
    });
  });

  it.skip("should output differences", function (done) {
    // TODO: Write the test
    done();
  });
});
