import { Body, Controller, HttpService, Logger, Post } from "@core/common";
import { retry } from "@server/operators";

import { DesignTemplate, DesignTextElement } from "@server/design/interfaces";

import { RuntimeException } from "@server/core/errors/exceptions/runtime.exception";
import { TemplateService } from "../service/template.service";
import { UpdateTextDao } from "./update-text.dao";
import { TextRender } from "@ui/design/render";
import { CanvasKitService } from "../../../thrid-party/canvas-kit/canvas-kit.service";
import { CanvasKit } from "@ui/canvaskit-wasm";

@Controller("/design/template")
export class TemplateController {
  requestFile: (url) => Promise<ArrayBuffer>;
  CanvasKit: CanvasKit;

  constructor(private templateService: TemplateService, private _httpService: HttpService,
              private _canvaskitService: CanvasKitService) {


    this.CanvasKit = this._canvaskitService.canvasKit;
    this.requestFile = (url) => {
      const req = this._httpService
        .get<ArrayBuffer>(`http:${url}`, { responseType: "arraybuffer" })
        .pipe(retry(3))
        .toPromise();
      return new Promise<ArrayBuffer>((resolve, reject) => {
        req
          .then((resp) => {
            resolve(resp.data);
          })
          .catch(reject);
      });
    };
  }
}
