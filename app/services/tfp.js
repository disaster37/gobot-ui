import { inject as service } from '@ember/service';
import Service from '@ember/service';

export default class TfpService extends Service {
  baseUrl = '/tfps';

  @service('ajax-app') client;

  call(name) {
    switch(name) {
      case "startPondPump": return this.startPondPump(); break;
      case "stopPondPump": return this.stopPondPump(); break;
      case "startUVC1": return this.startUVC1(); break;
      case "stopUVC1": return this.stopUVC1(); break;
      case "startUVC2": return this.startUVC2(); break;
      case "stopUVC2": return this.stopUVC2(); break;
      case "startPondBubble": return this.startPondBubble(); break;
      case "stopPondBubble": return this.stopPondBubble(); break;
      case "startFilterBubble": return this.startFilterBubble(); break;
      case "stopFilterBubble": return this.stopFilterBubble(); break;
      case "startWaterfallPump": return this.startWaterfallPump(); break;
      case "stopWaterfallPump": return this.stopWaterfallPump(); break;
    };
  }

  startWaterfallPump() {
    return this.client.post(this.baseUrl + '/action/start_waterfall_pump', { dataType: "text" });
  }

  stopWaterfallPump() {
    return this.client.post(this.baseUrl + '/action/stop_waterfall_pump', { dataType: "text" });
  }

  startPondPump() {
    return this.client.post(this.baseUrl + '/action/start_pond_pump', { dataType: "text" });
  }

  stopPondPump() {
    return this.client.post(this.baseUrl + '/action/stop_pond_pump', { dataType: "text" });
  }

  startUVC1() {
    return this.client.post(this.baseUrl + '/action/start_uvc1', { dataType: "text" });
  }

  stopUVC1() {
    return this.client.post(this.baseUrl + '/action/stop_uvc1', { dataType: "text" });
  }

  startUVC2() {
    return this.client.post(this.baseUrl + '/action/start_uvc2', { dataType: "text" });
  }

  stopUVC2() {
    return this.client.post(this.baseUrl + '/action/stop_uvc2', { dataType: "text" });
  }

  startPondBubble() {
    return this.client.post(this.baseUrl + '/action/start_pond_bubble', { dataType: "text" });
  }

  stopPondBubble() {
    return this.client.post(this.baseUrl + '/action/stop_pond_bubble', { dataType: "text" });
  }

  startFilterBubble() {
    return this.client.post(this.baseUrl + '/action/start_filter_bubble', { dataType: "text" });
  }

  stopFilterBubble() {
    return this.client.post(this.baseUrl + '/action/stop_filter_bubble', { dataType: "text" });
  }

}
