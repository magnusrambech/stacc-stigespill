"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var gameservice_service_1 = require("./gameservice.service");
describe('GameserviceService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [gameservice_service_1.GameserviceService]
        });
    });
    it('should be created', testing_1.inject([gameservice_service_1.GameserviceService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=gameservice.service.spec.js.map