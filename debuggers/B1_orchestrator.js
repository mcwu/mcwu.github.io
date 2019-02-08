try {
  if (window.QSI === undefined) window.QSI = {};
  if (QSI.reg === undefined) QSI.reg = {};
  if (QSI.ed === undefined) QSI.ed = {};
  if (QSI.reqID === undefined) QSI.reqID = {};

  QSI.overrides = QSI.overrides || {};

  if (typeof QSI.isFullDbgInitialized === "undefined") {
    QSI.isFullDbgInitialized = false;
  }

  QSI.initFullDbg = function() {
    if (QSI.isFullDbgInitialized === true) {
      return;
    }
    QSI.isFullDbgInitialized = true;
    QSI.dbg = {
      log: function() {},
      c: function(m) {
        try {console.log(m);}catch(e){}
        QSI.dbg.log(m);
      },
      d: function(m) {
        try {console.dir(m);}catch(e){}
        QSI.dbg.log(m);
      },
      t: function(m) {
        try {console.trace();}catch(e){}
        QSI.dbg.log(m);
      },
      e: function(m) {
        var message = "error";
        if(m.message)
          message = m.message;
        try
        {
          console.log(message);
          console.error(m);
        }
        catch(e)
        {
          try
          {
            console.log(message);
            console.log(m);
          }
          catch (e)
          {
          }
        }
        QSI.dbg.log(m);
      }
    };
  };

  if (window.location.href.indexOf('Q_DEBUG') === -1) {
    QSI.dbg = {
      log: function() {},
      c: function(m) { QSI.dbg.log(m); },
      d: function(m) { QSI.dbg.log(m); },
      t: function(m) { QSI.dbg.log(m); },
      e: function(m) { QSI.dbg.log(m); }
    };
  } else {
    QSI.initFullDbg();
  }

  if (typeof QSI.global === 'undefined') {
    QSI.global = {
      currentZIndex: 2000000000,
      imagePath: 'https://zncc5foiqgagifopn-mwub1prv.s1.b1-prv.qualtrics.com/SIE/../WRQualtricsShared/Graphics/',
      graphicPath: 'https://b1-prv.qualtrics.com/WRQualtricsSiteIntercept/Graphic.php?IM=',
      modulePath: 'https://a248.e.akamai.net/img.qualtrics.com/WRQualtricsShared/JavaScript/SiteInterceptEngine/',
      intercepts: {},
      eventTrackers: [],
      clientType: 'web',
      clientVersion: ''
    };
  }
      QSI.global.legacyId = 'SI_db4K2BSX353dtAN';
  QSI.global.baseURL = QSI.overrides.baseURL || 'https://s1.b1-prv.qualtrics.com';

  QSI.baseURL = QSI.overrides.siBaseURL || 'https://s1.b1-prv.qualtrics.com/WRSiteInterceptEngine/';

  if (typeof QSI.global.isHostedJS === 'undefined') {
    QSI.global.isHostedJS = function() {
      return QSI.global.clientType === 'hostedjs';
    };
  }

  QSI.Browser = {};

/*****************
 * Profile Module
 ****************/
if (!QSI.profile) {
  QSI.profile = {
    namespace: "QSI_",
    set: function(category, name, value, permanent) {
      if (category === undefined ||
        name === undefined ||
        value === undefined) {
        throw new Error('To few arguments');
      }

      try {
        var storage = this.getStorage(permanent),
            key = this.namespace + category,
            data = storage.getItem(key);

        data = (data) ? JSON.parse(data) : {};
        data[name] = value;
        data = JSON.stringify(data);
        storage.setItem(key, data);
      } catch (e) {
        QSI.dbg.e('error setting profile item');
        QSI.dbg.e(e);
      }
    },
    get: function(category, name, permanent) {
      var storage = this.getStorage(permanent),
          key = this.namespace + category,
          data = storage.getItem(key);

      if (data) {
        data = JSON.parse(data);
        if (name) {
          return (data[name]) ? data[name] : null;
        }
        return data;

      }
      return null;
    },
    erase: function(category, name, permanent) {
      var storage = this.getStorage(permanent),
          key = this.namespace + category;

      if (!name) {
        storage.removeItem(key);
      }
      else {
        var data = JSON.parse(storage.getItem(key));
        delete data[name];
        data = JSON.stringify(data);
        storage.setItem(key, data);
      }
    },
    getStorage: function(perm) {
      if (this.hasSessionStorage()) {
        if (perm) {
          return localStorage;
        } else {
          return sessionStorage;
        }
      }
      else if (QSI.UserDataStorage) {
        var userdata = QSI.UserDataStorage;
        if (perm) {
          userdata.isPermanent(true);
        } else {
          userdata.isPermanent(false);
        }
        return userdata;
      }
      else {
        return QSI.CookieStorage;
      }
    },
    hasSessionStorage: function() {
      // https://gist.github.com/paulirish/5558557
      var testKey = 'qualtricssessionstoragetestkey', storage = window.sessionStorage;
      try {
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
      }
      catch (e) {
        return false;
      }
    }
  };
}
if(QSI.util === undefined) {
  QSI.util = {
    $: function(n) {
      if (typeof n === 'string') {
        n = document.getElementById(n);
      }
      return n;
    },
    forOwn: function(obj, callback) {
      // TODO add check for callback
      if (obj && obj instanceof Object && this.isFunction(callback)) {
        for (var index in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, index)) {
            callback(obj[index], index, obj);
          }
        }
      }
    },
    build: function(type, att, inner) {
      var el = document.createElement(type);

      if (att) {
        var that = this;
        QSI.util.forOwn(att, function(value, id) {
          switch (id) {
            case 'style':
              that.setStyle(el, att[id]);
              break;
            case 'className':
              el.className = att[id];
              break;
            case 'id':
              el.id = att[id];
              break;
            default:
              el.setAttribute(id, att[id]);
          }
        });
      }
      if (inner) {

        if (QSI.util.isString(inner)) {
          if (type === 'style' && el.styleSheet) {
            el.styleSheet.cssText = inner;
          }
          else {
            el.appendChild(document.createTextNode(String(inner)));
          }
        }
        else if (QSI.util.isArray(inner)) {
          for (var i = 0, ilen = inner.length; i < ilen; i++) {
            var ch = inner[i];
            if (typeof ch === 'string' || typeof ch === 'number') {
              el.appendChild(document.createTextNode(String(ch)));
            }
            else if (ch) {
              if (ch.nodeType) {
                el.appendChild(ch);
              }
            }
          }
        }
      }
      return el;
    },
    setStyle: function(el, s) {
      QSI.util.forOwn(s, function(value, sid) {
        try {
          el.style[sid] = s[sid];
        } catch (e) {
          QSI.dbg.e(e);
        }
      });
    },
    isString: function(s) {
      return (typeof(s) === 'string');
    },
    isArray: function(a) {
      return typeof(a) === 'object' && (a instanceof Array);
    },
    getQueryParam: function(url, key) {
      key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + key + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(url);
      if (results === null) {
        return "";
      } else {
        return results[1];
      }
    },
    observe: function(el, e, f, preventRemove) {
      this.obs = this.obs || [];
      if (el) {
        this.obs.push({
          el: el,
          e: e,
          f: f,
          preventRemove: preventRemove || false
        });
        if (el.addEventListener) {
          el.addEventListener(e, f, false);
        }
        else if (el.attachEvent) {
          el.attachEvent("on" + e, f);
        }
        else if (el['on' + this.capFirst(e)]) {
          el['on' + this.capFirst(e)] = f;
        }
      }

    },
    stopObserving: function(el, e, f) {
      if (el.removeEventListener) {
        el.removeEventListener(e, f, false);
      }
      else if (el.detachEvent) {
        el.detachEvent("on" + e, f);
      }
      else if (el['on' + this.capFirst(e)]) {
        el['on' + this.capFirst(e)] = null;
      }
    },
    removeObservers: function() {
      var that = this;
      this.each(this.obs || [], function(ob) {
        if (!ob.preventRemove) {
          that.stopObserving(ob.el, ob.e, ob.f);
        }
      });
    },
    remove: function(el) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
    isFunction: function(a) {
      return typeof a === 'function' || false;
    },
    capFirst: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    each: function(array, callback) {
      var length = array.length;
      if (length) {
        for (var i = 0; i < length; i++) {
          callback(array[i], i);
        }
      }
    }
  };
}if (!QSI.API || window.QTest) {
  /**
   * The <t>Site Intercept JavaScript API</t> is provided as a simple, constant interface that allows users to have
   * more control over their intercepts.
   *
   * See the {{#crossLink "API/Events:property"}}{{/crossLink}} property for an example of how to trigger events.
   *
   * @class API
   * @static
   */
  QSI.API = {
    /**
     * Loads the script tags for any intercepts/zones on the page. This will make a request back to the Site Intercept servers
     * simulating a normal page refresh.
     *
     * @method load
     * @example
     *  // Loads the Site Intercept code for any defined intercepts or creatives
     *  QSI.API.load();
     *  // Starts the intercept code evaluation.
     *  QSI.API.run();
     */
    load: function() {
      function loadHelper(deferred) {
        try {

          // If QSI.API.load is called multiple times we do not want to call QSI.Orchestrator.load multiple times
          // QSI.reg is only defined by QSI.API.load and undefined by QSI.API.unload
          // we also dont want to call load if QSI.API.unload is currently running
          if (QSI.reg || this.unloading) {
            deferred.reject();
            return;
          }
          if (window.QSI === undefined) {
            window.QSI = {};
          }
          if (QSI.reg === undefined) {
            QSI.reg = {};
          }
          if (QSI.ed === undefined) {
            QSI.ed = {};
          }
          if (QSI.reqID === undefined) {
            QSI.reqID = {};
          }
          if (QSI.Request === undefined) {
            QSI.Request = {};
          }
          if (QSI.styleElements === undefined) {
            QSI.styleElements = [];
          }

          QSI.util.forOwn(QSI.reqID, function(value, id) {
            var requestParams = {};
            requestParams.loadingFromAPI = true;
            requestParams.id = id;
            if (QSI.version === 'Editing') {
              requestParams.version = '0';
            }

            if (typeof QSI.global.clientVersion !== 'undefined' && QSI.global.clientVersion !== null) {
              requestParams.Q_CLIENTVERSION = QSI.global.clientVersion;
            }

            if (typeof QSI.global.clientType !== 'undefined' && QSI.global.clientType !== null) {
              requestParams.Q_CLIENTTYPE = QSI.global.clientType;
            }

            if (id.search(/ZN/) === 0) {
              requestParams.ZoneID = id;
            } else {
              requestParams.InterceptID = id;
            }

            if (QSI.isDebug) {
              requestParams.Q_DEBUG = null;
            }
            requestParams.deferred = deferred;

            (function() {
              QSI.Orchestrator.load(requestParams);
            })(requestParams);
          });
        } catch (e) {
          QSI.dbg.e(e);
        }
      }

      try {
        var deferred = QSI.Orchestrator.Deferred();
        var promise = deferred.promise();
        if (!QSI.PendingQueue) {
          QSI.PendingQueue = [];
        }
        if (QSI.LoadingState && QSI.LoadingState.length > 0){
          QSI.PendingQueue.push(loadHelper.bind(this, deferred));
        } else{
          loadHelper.bind(this, deferred)();
        }

        return promise;
      } catch (e) {
        QSI.dbg.e(e);
      }
    },
    /**
     * Unloads any intercepts on the page. All creatives are removed and the main QSI object is returned to a blank state.
     *
     * @method unload
     * @example
     *  // Removes any currently displaying creatives
     *  QSI.API.unload();
     *  // Loads the Site Intercept code for any defined intercepts or creatives
     *  QSI.API.load();
     */
    unload: function() {
      try {
        if (!QSI.PendingQueue) {
          QSI.PendingQueue = [];
        }
        if(QSI.LoadingState && QSI.LoadingState.length > 0){
          QSI.PendingQueue.push(QSI.API.unload);
          return;
        }

        this.unloading = true;
        if (QSI.reg) {
          QSI.util.forOwn(QSI.reg, function(value, id) {
            var creative = QSI.reg[id];
            creative.remove();
          });
          QSI.util.removeObservers();
        }
        if (QSI.debug) {
          QSI.util.remove(QSI.util.$('QSI_Debug'));
          QSI.debuggerHasDisplayed = false;
        }
        if (QSI.styleElements) {
          var styleElements = QSI.styleElements;
          for (var i = 0; i < styleElements.length; i++) {
            QSI.util.remove(styleElements[i]);
          }
        }
        QSI.reg = undefined;
        QSI.Request = undefined;
        QSI.styleElements = undefined;
        this.unloading = false;
      } catch (e) {
        QSI.dbg.e(e);
      }
    },
    /**
     * Runs all defined intercepts on the page. When manually loading intercepts this <b>MUST</b> be called after
     * loading the page or calling QSI.API.load() for the intercept to show.
     *
     * @method run
     * @example
     *  // Loads the Site Intercept code for any defined intercepts or creatives
     *  QSI.API.load();
     *  // Starts the intercept code evaluation.
     *  QSI.API.run();
     */
    run: function() {
      try {
        if (!QSI.PendingQueue) {
          QSI.PendingQueue = [];
        }
        if(QSI.LoadingState && QSI.LoadingState.length > 0){
          QSI.PendingQueue.push(QSI.API.run);
          return;
        }
        if (!QSI.InterceptsRan && QSI.reg !== undefined) {
          QSI.RunIntercepts(null, true);
        }
      } catch (e) {
        QSI.dbg.e(e);
      }
    },
    /**
     * Tracking events allows a user to know how many times a client has performed a certain action. Any events being tracked
     * can be passed as embedded data to the intercept target.
     *
     * An event can be tracked by using the following:
     * @example
     *  // gets the window._qsie variable or sets it to an array
     *  window._qsie = window._qsie || [];
     *  window._qsie.push('eventName');
     * @property {Object} Events
     */
    Events: {
      increment: function(name) {
        try {
          QSI.EventTracker.track(name);
        } catch (e) {
          QSI.dbg.e(e);
        }
      },
      /**
       * Gets the number of times the given event occurred.
       *
       * @method Events.count
       * @param {String} name The name of the event
       * @return {Number} The number of times the event has occurred.
       * @example
       *  // Gets the event count
       *  var count = QSI.API.Events.count('eventName');
       */
      count: function(name) {
        try {
          return QSI.EventTracker.get(name);
        } catch (e) {
          QSI.dbg.e(e);
        }
      },
      push: function(name) {
        try {
          QSI.EventTracker.track(name);
        } catch (e) {
          QSI.dbg.e(e);
        }
      }
    }
  };
}QSI.AssetManager = {
  loadedScripts: {},
  promiseFetch: function(method, route, data) {
    var deferred = QSI.Orchestrator.Deferred();

    var http = new XMLHttpRequest();
    http.open(method, route, true);

    // This allows cookies to be sent
    http.withCredentials = true;

    // This option is for dependency resolver requests
    if (method === 'POST') {
       http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    http.onreadystatechange = function() {
      if (4 === http.readyState) {
        if (200 === http.status) {
          deferred.resolve(http.responseText);
        } else {
          deferred.reject(http.responseText);
        }
      }
    };

    http.send(data);
    return deferred.promise();
  },
  generateDefinitionRequestURL: function(module, version, inputParams, interceptId) {
    var url = QSI.baseURL + 'Asset.php?';
    var params = [];

    //inputParams.version is the version requested via query params, while version is from the targeting call
    //inputParams.version should be set only if the editing version is requested, and it will be 0
    //if something does not have an editing version, version will give use the latest version, which can never change due to how our revisions are published
    //because of this, we want version to take precedence, to take advantage of our akamai cache
    version = version || inputParams.version;
    params.push('Module=' + module);
    params.push('Version=' + version);

    if (typeof interceptId !== 'undefined' && interceptId !== null) {
      params.push('Q_InterceptID=' + interceptId);
    }
    if (inputParams.Q_NOCACHE === null) {
      params.push('Q_NOCACHE');
    }
    if (QSI.CORSOrigin) {
      params.push('Q_ORIGIN=' + QSI.CORSOrigin);
    }
    if (typeof inputParams.Q_CLIENTVERSION !== 'undefined' && inputParams.Q_CLIENTVERSION !== null) {
      params.push('Q_CLIENTVERSION=' + inputParams.Q_CLIENTVERSION);
    }
    if (typeof inputParams.Q_CLIENTTYPE !== 'undefined' && inputParams.Q_CLIENTTYPE !== null) {
      params.push('Q_CLIENTTYPE=' + inputParams.Q_CLIENTTYPE);
    }

    url += params.join('&');

    return url;
  },
  loadDefinition: function(url, callback) {
    var deferred = QSI.Orchestrator.Deferred();
    var http = new XMLHttpRequest();

    http.open('GET', url, true);

    http.onreadystatechange = function() {
      if (4 === http.readyState) {
        if (200 === http.status) {
          try {
            // Attempt to parse response text
            var response = JSON.parse(http.responseText);

            if (!response.Error) {
              callback(response);
              deferred.resolve(http.responseText);
            } else {
              deferred.reject(response);
            }
          } catch (e) {
            deferred.reject(http.responseText);
          }
        } else {
          deferred.reject(http.responseText);
        }
      }
    };
    http.send();

    return deferred.promise();
  },
  promiseLoadIntercept: function(id, intercept, inputParams) {
    var url = QSI.AssetManager.generateDefinitionRequestURL(intercept.InterceptID,
      intercept.InterceptRevision, inputParams);

    return QSI.AssetManager.loadDefinition(url, function(intercept) {
      QSI.Request[id].Intercepts[intercept.InterceptDefinition.InterceptID].Intercept = intercept.InterceptDefinition;
    });
  },
  promiseLoadCreative: function(id, intercept, inputParams) {
    if (intercept.Decision.Creative.ID !== 'CR_NoCreative') {
      var url = QSI.AssetManager.generateDefinitionRequestURL(intercept.Decision.Creative.ID,
        intercept.Decision.Creative.Revision, inputParams, intercept.InterceptID);

      return QSI.AssetManager.loadDefinition(url, function(creative) {
        if(QSI.util.isLegacyCreative(creative.CreativeDefinition.Type)) {
          creative.CreativeDefinition = QSI.AssetManager.sortCreativeDefinition(creative.CreativeDefinition);
        }

        QSI.Request[id].Intercepts[intercept.InterceptID].Creative = creative.CreativeDefinition;
      });
    } else {
      QSI.Request[id].Intercepts[intercept.InterceptID].Creative = null;
      return QSI.Orchestrator.Deferred().resolve(null);
    }
  },
  promiseLoadPopUnderTarget: function(id, intercept, inputParams) {
    var url = QSI.AssetManager.generateDefinitionRequestURL(intercept.Decision.PopUnderTarget.ID,
      intercept.Decision.PopUnderTarget.Revision, inputParams, intercept.InterceptID);

    return QSI.AssetManager.loadDefinition(url, function(creative) {
      QSI.Request[id].Intercepts[intercept.InterceptID].PopUnderTarget = creative.CreativeDefinition;
    });
  },
  promiseLoadScript: function(scriptName, version) {
    var deferred;

    if (this.alreadyFetched(scriptName)) {
      deferred = QSI.Orchestrator.Deferred();
      deferred.resolve();
      return deferred.promise();
    }

    deferred = QSI.Orchestrator.Deferred();

    var script = document.createElement('script');

    var isHostedJS = QSI.global.isHostedJS();
    if (isHostedJS) {
      script.src = QSI.global.hostedJSLocation + scriptName + "Module.js";
    }
    else {
      script.src = QSI.baseURL + 'Asset.php?Module=' + scriptName + '&Version=' + version;
    }

    if (typeof QSI.Orchestrator.getClientVersionQueryString !== 'undefined') {
      if (isHostedJS) {
        script.src += '?';
      } else {
        script.src += '&';
      }
      script.src = script.src + QSI.Orchestrator.getClientVersionQueryString();
    }
    script.defer = true;

    script.addEventListener('load', function() {
      try {
        if (QSI.wrongModuleVersionRequested === true) {
          deferred.reject();
          QSI.dbg.e('Script: ' + scriptName + ' failed to load because an unavailable version (' + version + ') was requested.');
        }
        QSI.AssetManager.loadedScripts[scriptName] = script;
        deferred.resolve();
      } catch(e) {
        if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
          QSI.dbg.e(e);
        }
      }
    }, false);

    script.addEventListener('error', function() {
      try {
        deferred.reject();
        QSI.dbg.e('Script: ' + scriptName + ' failed to load.');
      } catch(e) {
        if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
          QSI.dbg.e(e);
        }
      }
    });

    document.body.appendChild(script);

    return deferred.promise();
  },
  alreadyFetched: function(scriptName) {
    return scriptName in QSI.AssetManager.loadedScripts;
  },

  // This function is used to sort the creativeDefiniton for accessibility reasons. We need all creative elements to be in a top left to bottom right
  // positional order so elements are keyboard accessible in a logical order.
  sortCreativeDefinition:function(definition)
  {
    if (definition && definition.Options && definition.Options.elements && definition.Options.elements.Elements) {
      // get elements from creative definition
      var elementsArray = definition.Options.elements.Elements;

      // sort by z-index position
      elementsArray = QSI.util.stableSort(elementsArray, function(p1, p2) {
        if (Number(p1.style.zIndex) < Number(p2.style.zIndex)) {
          return -1;
        }
        if (Number(p1.style.zIndex) > Number(p2.style.zIndex)) {
          return 1;
        }
        return 0;
      });
      for (var i = 0; i < elementsArray.length; i++) {
        // In the creative editor, all elements are added with a zIndex of 2000000000 so elements are rendered on top or behind other elements
        // based on order in DOM. Only when an element is "brought forward" or "put behind" do we adjust zIndex values in the elements style
        // to fix this for accessibility we need sorted by Z-index above while respecting order (so elements with the same zIndex are in the right order)
        // and now we want to set their zIndex in an increasing fashion so that when we sort again by left and top position below, zIndex is respected
        if (elementsArray[i].style && elementsArray[i].style.zIndex) {
          elementsArray[i].style.zIndex = QSI.global.currentZIndex++;
        }
      }

      // sort by left position
      elementsArray = QSI.util.stableSort(elementsArray, function(p1, p2) {
        if (Number(p1.position.left) < Number(p2.position.left)) {
          return -1;
        }
        if (Number(p1.position.left) > Number(p2.position.left)) {
          return 1;
        }
        return 0;
      });

      // sort by top position
      elementsArray = QSI.util.stableSort(elementsArray, function(p1, p2) {
        if (Number(p1.position.top) < Number(p2.position.top)) {
          return -1;
        }
        if (Number(p1.position.top) > Number(p2.position.top)) {
          return 1;
        }
        return 0;
      });

      definition.Options.elements.Elements = elementsArray;

      return definition;
    }
    return definition;
  }
};QSI.CreativeManager = {
  isCreativeSupported: function(creative) {
    return QSI.CreativeManager['run' + creative] ? true : false;
  },
  runEmpty: function(data) {
    (function() {
      var QSIEmpty = new QSI.Empty({
        id: data.interceptID,
        type: QSI.util.creativeTypes.EMPTY
      });
      QSI.reg[data.interceptID] = QSIEmpty;
    })();
  },
  runWebNotification: function(data) {
    (function() {
      var creativeType = data.creative.Type;

      var QSIWebNotification = new QSI.WebNotification({
        id: data.interceptID,
        type: creativeType,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        elements: data.creative.Options,
        displayOptions: data.creative.Options.displayOptions
      });
      QSI.reg[data.interceptID] = QSIWebNotification;
    })();
  },
  runWebResponsiveDialog: function(data) {
    (function() {
      var creativeType = data.creative.Type;
      var creativeTypeLayout = data.creative.Options.Layout;
      var parentContainerClass = QSI.BuildResponsiveElementModule.PARENT_CONTAINER_CLASS;
      var QSIWebResponsiveDialog = new QSI.WebResponsive[creativeType][creativeTypeLayout]({
        id: data.interceptID,
        type: creativeType,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        hasCreativeEmbeddedTarget: QSI.CreativeManager.Utilities.hasCreativeEmbeddedTarget(data.creative),
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        elements: data.creative.Options,
        displayOptions: data.creative.Options.displayOptions,
        resetStyle: QSI.CreativeManager.Utilities.getWebResponsiveResetStyle(parentContainerClass)
      });
      QSI.reg[data.interceptID] = QSIWebResponsiveDialog;
    })();
  },
  runFeedbackLink: function(data) {
    (function() {
      var QSIFeedbackLink = new QSI.FeedbackLink({
        id: data.interceptID,
        type: QSI.util.creativeTypes.FEEDBACK_LINK,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        insertionLocation: data.actionSet.ActionOptions.displayElement ?
          data.actionSet.ActionOptions.displayElement : data.id,
        displayOptions: data.creative.Options
      });
      QSI.reg[data.interceptID] = QSIFeedbackLink;
    })();
  },
  runHTTPRedirect: function(data) {
    if (QSI.global.isHostedJS()) {
      QSI.dbg.c("Creative type '" + QSI.util.creativeTypes.HTTP_REDIRECT + "' is not supported.");
    }
    else {
      (function() {
        var QSIHTTPRedirect = new QSI.HTTPRedirect({
          id: data.interceptID,
          type: QSI.util.creativeTypes.HTTP_REDIRECT,
          targetURL: data.decision.Target.URL,
          targetURLOrigin: data.decision.Target.OriginalURLOrigin,
          impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
            interceptID: data.interceptID,
            creativeID: data.decision.Creative.ID,
            asid: data.decision.ActionSetID
          }),
          interceptDisplayOptions: data.intercept.DisplayOptions,
          actionOptions: data.actionSet.ActionOptions
        });
        QSI.reg[data.interceptID] = QSIHTTPRedirect;
      })();
    }
  },
  runIFrame: function(data) {
    (function() {
      var QSIIFrame = new QSI.IFrame({
        id: data.interceptID,
        type: QSI.util.creativeTypes.IFRAME,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        iframeOptions: data.creative.Options,
        insertionLocation: data.actionSet.ActionOptions.displayElement ?
          data.actionSet.ActionOptions.displayElement : data.id
      });
      QSI.reg[data.interceptID] = QSIIFrame;
    })();
  },
  runInfoBar: function(data) {
    (function() {
      var infoBarParameters = {
        id: data.interceptID,
        type: QSI.util.creativeTypes.INFO_BAR,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        displayOptions: data.creative.Options.displayOptions
      };

      if (data.creative.Options.elements) {
        infoBarParameters.elements = data.creative.Options.elements;
        infoBarParameters.resetStyle = QSI.CreativeManager.Utilities.getResetStyle('QSIInfoBar');
      } else {
        infoBarParameters.infoBarOptions = data.creative.Options;
        var locators = QSI.CreativeManager.Utilities.parsePipedText(data.creative.Options.content);
        if (locators && locators.length > 0) {
          infoBarParameters.locators = locators;
        }
      }

      var QSIInfoBar = new QSI.InfoBar(infoBarParameters);
      QSI.reg[data.interceptID] = QSIInfoBar;
    })();
  },
  runLink: function(data) {
    (function() {
      var locators = QSI.CreativeManager.Utilities.parsePipedText(data.creative.Options.linkText);

      var QSILink = new QSI.Link({
        id: data.interceptID,
        type: QSI.util.creativeTypes.LINK,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        text: data.creative.Options.linkText,
        insertionLocation: data.actionSet.ActionOptions.displayElement ?
          data.actionSet.ActionOptions.displayElement : data.id,
        locators: locators && locators.length > 0 ? locators : null
      });
      QSI.reg[data.interceptID] = QSILink;
    })();
  },
  runNoCreative: function(data) {
    (function() {
      var QSINoCreative = new QSI.NoCreative({
        id: data.interceptID,
        type: QSI.util.creativeTypes.NO_CREATIVE,
        actionOptions: data.actionSet.ActionOptions,
        interceptDisplayOptions: data.intercept.DisplayOptions
      });
      QSI.reg[data.interceptID] = QSINoCreative;
    })();
  },
  runPopOver: function(data) {
    (function() {
      var QSIPopOver = new QSI.PopOver({
        id: data.interceptID,
        type: QSI.util.creativeTypes.POP_OVER,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        hasCreativeEmbeddedTarget: QSI.CreativeManager.Utilities.hasCreativeEmbeddedTarget(data.creative),
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        elements: data.creative.Options.elements,
        displayOptions: data.creative.Options.displayOptions,
        resetStyle: QSI.CreativeManager.Utilities.getResetStyle('QSIPopOver')
      });
      QSI.reg[data.interceptID] = QSIPopOver;
    })();
  },
  runPopUnder: function(data) {
    // Do not show on Chrome 30+
    (function() {
      if (QSI.Browser.name === 'Chrome' && QSI.Browser.version > 29) {
        return;
      }

      var creativeOptions = data.creative.Options;

      var popUnderParameters = {
        id: data.interceptID,
        type: QSI.util.creativeTypes.POP_UNDER,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions
      };

      if (data.creative.Options.elements) {
        popUnderParameters.elements = data.creative.Options.elements;

        var resetStyle = 'body { background-color: ' + creativeOptions.baseElement.style.backgroundColor +
          '; } .QSIPopUnder .close { color: #000000; text-decoration: none; } ';

        popUnderParameters.resetStyle = resetStyle + QSI.CreativeManager.Utilities.getResetStyle('QSIPopUnder');
        creativeOptions.width = creativeOptions.baseElement.style.width;
        creativeOptions.height = creativeOptions.baseElement.style.height;
      } else {
        // TODO: Implement
        popUnderParameters.locators = QSI.CreativeManager.Utilities.parsePipedText(null);
      }

      // Get popunderhelper URL
      // PopUnderMixin, PopUnder, PopUnderWatcher should be loaded IN THAT ORDER
      creativeOptions.helperScriptSrc = QSI.baseURL + 'Orchestrator.php?InterceptID=' +
        data.interceptID + '&Q_Type=PopUnderHelper';

      var helperOptions = {
        onPopForwardShowTarget: creativeOptions.showTargetOnPopForward,
        showOnPageChange: creativeOptions.showOnPageChange,
        showOnSiteExit: creativeOptions.showOnSiteExit,
        checkThreshold: 3,
        watchInterval: 1000,
        targetWidth: data.actionSet.ActionOptions.targetWidth,
        targetHeight: data.actionSet.ActionOptions.targetHeight,
        targetFullScreen: data.actionSet.ActionOptions.targetFullScreen,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        })
      };

      popUnderParameters.popunderOptions = creativeOptions;
      popUnderParameters.popunderHelperOptions = helperOptions;

      var QSIPopUnder = new QSI.PopUnder(popUnderParameters);
      QSI.reg[data.interceptID] = QSIPopUnder;
    })();
  },
  runPopUnderHelper: function(data) {
    QualtricsSI[data.interceptID].popunderCheckThreshold = null; // jshint ignore:line
    QualtricsSI[data.interceptID].popunderWatchInterval = null; // jshint ignore:line
    QualtricsSI.PopunderWatcherModule.startWatching(data.interceptID); // jshint ignore:line
  },
  runPopUp: function(data) {
    (function() {
      var QSIPopUp = new QSI.PopUp({
        id: data.interceptID,
        type: QSI.util.creativeTypes.POP_UP,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        creativeOptions: data.creative.Options
      });
      QSI.reg[data.interceptID] = QSIPopUp;
    })();
  },
  runRelay: function(data) {
    (function() {
      var QSIRelay = new QSI.Relay({
        id: data.interceptID,
        type: QSI.util.creativeTypes.RELAY,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        elements: data.creative.Options.elements,
        containerElement: data.creative.Options.baseElement,
        displayOptions: data.creative.Options.displayOptions,
        resetStyle: QSI.CreativeManager.Utilities.getResetStyle('QSIRelay')
      });
      QSI.reg[data.interceptID] = QSIRelay;
    })();
  },
  runSlider: function(data) {
    (function() {
      var QSISlider = new QSI.Slider({
        id: data.interceptID,
        type: QSI.util.creativeTypes.SLIDER,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        hasCreativeEmbeddedTarget: QSI.CreativeManager.Utilities.hasCreativeEmbeddedTarget(data.creative),
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        elements: data.creative.Options.elements,
        displayOptions: data.creative.Options.displayOptions,
        resetStyle: QSI.CreativeManager.Utilities.getResetStyle('QSISlider')
      });
      QSI.reg[data.interceptID] = QSISlider;
    })();
  },
  runSocialMedia: function(data) {
    (function() {
      var QSISocialMedia = new QSI.SocialMedia({
        id: data.interceptID,
        type: QSI.util.creativeTypes.SOCIAL_MEDIA,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        buttons: data.creative.Options.buttons,
        buttonStyles: QSI.CreativeManager.SocialMediaHelper.getButtonStyles(data.creative),
        displayOptions: data.creative.Options.displayOptions,
        insertionLocation: data.actionSet.ActionOptions.displayElement ?
          data.actionSet.ActionOptions.displayElement : data.id
      });
      QSI.reg[data.interceptID] = QSISocialMedia;
    })();
  },
  runUserDefinedHTML: function(data) {
    (function() {
      var userDefinedHTMLParameters = {
        id: data.interceptID,
        type: QSI.util.creativeTypes.USER_DEFINED_HTML,
        targetURL: data.decision.Target.URL,
        targetURLOrigin: data.decision.Target.OriginalURLOrigin,
        impressionURL: QSI.CreativeManager.Utilities.getImpressionURL({
          interceptID: data.interceptID,
          creativeID: data.decision.Creative.ID,
          asid: data.decision.ActionSetID
        }),
        interceptDisplayOptions: data.intercept.DisplayOptions,
        actionOptions: data.actionSet.ActionOptions,
        displayOptions: data.creative.Options.displayOptions,
        insertionLocation: data.actionSet.ActionOptions.displayElement ?
          data.actionSet.ActionOptions.displayElement : data.id
      };

      if (data.creative.Options.elements) {
        userDefinedHTMLParameters.elements = data.creative.Options.elements;
        userDefinedHTMLParameters.resetStyle = QSI.CreativeManager.Utilities.getResetStyle('QSIUserDefinedHTML');
      } else {
        userDefinedHTMLParameters.html = data.creative.Options.html;
        userDefinedHTMLParameters.size = data.creative.Options.size;
        var locators = QSI.CreativeManager.Utilities.parsePipedText(data.creative.Options.html);
        if (locators && locators.length > 0) {
          userDefinedHTMLParameters.locators = locators;
        }
      }

      var QSIUserDefinedHTML = new QSI.UserDefinedHTML(userDefinedHTMLParameters);
      QSI.reg[data.interceptID] = QSIUserDefinedHTML;
    })();
  }
};QSI.CreativeManager.SocialMediaHelper = {
  getButtonStyles: function(creative) {
    var size = creative.Options.displayOptions.size;
    if (creative.Options.displayOptions.useWidget) {
      if (size === 'Large') {
        size = '80px';
      } else {
        size = '';
      }
    }

    var themeStyles = QSI.CreativeManager.SocialMediaHelper.getThemeStyles(creative);
    var padding = QSI.CreativeManager.SocialMediaHelper.getPadding(size);
    var positionRelativeStyles = QSI.CreativeManager.SocialMediaHelper.getBoxShadow(creative, size);
    var width = QSI.CreativeManager.SocialMediaHelper.getWidth(creative, size);

    var buttonStyles = '.QSI_SocialMediaButton { ' +
      'float: left; ' +
      'cursor: pointer; ' +
      'background: ' + themeStyles.background + '; ' +
      'border-bottom: ' + themeStyles.border + '; ' +
      'border-right: ' + themeStyles.border + '; ' +
      'border-top: ' + themeStyles.highlight + '; ' +
      'border-left: ' + themeStyles.highlight + '; } ' +
      '#QSI_SocialMediaContainer { ' +
      'border-top: ' + themeStyles.border + '; ' +
      'border-left: ' + themeStyles.border + '; ' +
      'box-shadow: ' + positionRelativeStyles.shadowOutset + '; ' +
      'border-radius: ' + positionRelativeStyles.borderRadius + '; } ';

      if (creative.Options.displayOptions.useWidget) {
        buttonStyles += QSI.CreativeManager.SocialMediaHelper.getWidgetStyles(creative, size);

        if (size === 'Large') {
          buttonStyles += '#QSI_SocialMediaContainer { width: ' + width + '; } ';
        }
      } else {
        buttonStyles += '#QSI_SocialMediaContainer { width: ' + width + '; } ' +
          '.QSI_SocialMediaButton { ' +
          'padding: ' + padding + '; ' +
          'width: ' + size + '; ' +
          'height: ' + size + '; } ';
      }

      if (QSI.CreativeManager.SocialMediaHelper.getMaxCols(creative) === 1) {
        buttonStyles += '.QSI_First .QSI_SocialMediaButton { ' +
          'border-radius: ' + positionRelativeStyles.firstBorderRadius + '; } ' +
          '.QSI_Last .QSI_SocialMediaButton { ' +
          'border-radius: ' + positionRelativeStyles.lastBorderRadius + '; } ';
      } else {
        buttonStyles += '.QSI_First .QSI_SocialMediaButton.QSI_First { ' +
          'border-radius: ' + positionRelativeStyles.tlBorderRadius + '; } ' +
          'QSI_First .QSI_SocialMediaButton.QSI_Last { ' +
          'border-radius: ' + positionRelativeStyles.trBorderRadius + '; } ' +
          'QSI_Last .QSI_SocialMediaButton.QSI_First { ' +
          'border-radius: ' + positionRelativeStyles.blBorderRadius + '; } ' +
          'QSI_Last .QSI_SocialMediaButton.QSI_Last { ' +
          'border-radius: ' + positionRelativeStyles.brBorderRadius + '; } ';
      }

      return buttonStyles;
  },
  getThemeStyles: function(creative) {
    var colors = {
      background: 'none',
      border: 'none',
      highlight: 'none'
    };

    switch (creative.Options.displayOptions.theme) {
      case 'Transparent':
        break;
      case 'Glass':
        if (!(QSI.Browser.name === 'Internet Explorer' && QSI.Browser.version < 8)) {
          colors.background = 'rgba(255, 255, 255, .4)';
          colors.border = '1px solid rgba(200, 200, 200, .6)';
          colors.highlight = '1px solid rgba(255, 255, 255, .8)';
          break;
        }
        /* falls through */
      case 'Light':
        colors.background = '#E6E6E6';
        colors.border = '1px solid #B3B3B3';
        colors.highlight = '1px solid #FFFFFF';
        break;
      case 'Medium':
        colors.background = '#666666';
        colors.border = '1px solid #4D4D4D';
        colors.highlight = '1px solid #7D7D7D';
        break;
      case 'Dark':
        colors.background = '#333333';
        colors.border = '1px solid #1A1A1A';
        colors.highlight = '1px solid #484848';
        break;
    }

    return colors;
  },
  getPadding: function(size) {
    var padding = '';
    switch (size) {
      case '64px':
        padding = '8px';
        break;
      case '48px':
        padding = '7px';
        break;
      case '32px':
        padding = '6px';
        break;
      case '24px':
        padding = '5px';
        break;
      case 'Large':
        break;
    }

    return padding;
  },
  getBoxShadow: function(creative, size) {
    var opacity = '0';
    var positionStyles = {};
    if (size === 'Small') {
      return {
        shadowOutset: 'none',
        shadowInset: 'none',
        borderRadius: 'none',
        tlBorderRadius: 'none',
        trBorderRadius: 'none',
        blBorderRadius: 'none',
        brBorderRadius: 'none',
        firstBorderRadius: 'none',
        lastBorderRadius: 'none'
      };
    }

    switch (creative.Options.displayOptions.theme) {
      case 'Transparent':
        break;
      case 'Glass':
        opacity = 0.15;
        break;
      case 'Light':
        opacity = 0.25;
        break;
      case 'Medium':
        opacity = 0.45;
        break;
      case 'Dark':
        opacity = 0.6;
        break;
    }

    positionStyles.shadowOutset = '0px 0px 10px 0px rgba(0, 0, 0, ' + opacity + ')';
    positionStyles.shadowInset = 'none';
    var borderRadius = '3px';

    switch (size) {
      case '64px':
        borderRadius = '6px';
        break;
      case '48px':
        borderRadius = '5px';
        break;
      case '32px':
        borderRadius = '4px';
        break;
      case '24px':
        borderRadius = '3px';
        break;
    }

    positionStyles.borderRadius = borderRadius;
    positionStyles.tlBorderRadius = borderRadius + ' 0px 0px 0px';
    positionStyles.trBorderRadius = '0px ' + borderRadius + ' 0px 0px';
    positionStyles.blBorderRadius = '0px 0px 0px ' + borderRadius;
    positionStyles.brBorderRadius = '0px 0px ' + borderRadius + ' 0px';
    positionStyles.firstBorderRadius = borderRadius + ' ' + borderRadius + ' 0px 0px';
    positionStyles.lastBorderRadius = '0px 0px ' + borderRadius + ' ' + borderRadius;

    if (creative.Options.displayOptions.xOffset === 0) {
      switch (creative.Options.displayOptions.position) {
        case 'OTLL':
        case 'OML':
        case 'OBLL':
          positionStyles.shadowOutset = '0px -4px 10px -2px rgba(0, 0, 0, ' +
            opacity + '), -5px 0px 10px -4px rgba(0, 0, 0, ' +
            opacity + '), -2px 4px 10px -3px rgba(0, 0, 0, ' + opacity + ')';
          positionStyles.borderRadius = borderRadius + ' 0px 0px ' + borderRadius;
          positionStyles.tlBorderRadius = borderRadius + ' 0px 0px ' + borderRadius;
          positionStyles.trBorderRadius = 'none';
          positionStyles.blBorderRadius = '0px 0px 0px ' + borderRadius;
          positionStyles.brBorderRadius = 'none';
          positionStyles.firstBorderRadius = borderRadius + ' 0px 0px 0px';
          positionStyles.lastBorderRadius = '0px 0px 0px ' + borderRadius;
          break;
        case 'OTRR':
        case 'OMR':
        case 'OBRR':
          positionStyles.shadowOutset = '2px -5px 10px -3px rgba(0, 0, 0, ' +
            opacity + '), 8px 0px 10px -6px rgba(0, 0, 0, ' +
            opacity + '), 0px 5px 10px -3px rgba(0, 0, 0, ' + opacity + ')';
          positionStyles.borderRadius = '0px ' + borderRadius + ' ' + borderRadius + ' 0px';
          positionStyles.tlBorderRadius = 'none';
          positionStyles.trBorderRadius = '0px ' + borderRadius + ' 0px 0px';
          positionStyles.blBorderRadius = 'none';
          positionStyles.brBorderRadius = '0px 0px ' + borderRadius + ' 0px';
          positionStyles.firstBorderRadius = '0px ' + borderRadius + ' 0px 0px';
          positionStyles.lastBorderRadius = '0px 0px ' + borderRadius + '0px';
          break;
      }
    }

    return positionStyles;
  },
  getWidth: function(creative, size) {
    var width = 0;
    switch (size) {
      case '64px':
        width = 82;
        break;
      case '48px':
        width = 64;
        break;
      case '32px':
        width = 46;
        break;
      case '24px':
        width = 38;
        break;
      case 'Large':
      case 'Small':
        width = 82;
        break;
    }

    return width * QSI.CreativeManager.SocialMediaHelper.getMaxCols(creative);
  },
  getMaxCols: function(creative) {
    var maxCol = 0;
    for (var row in creative.Options.buttons) {
      if (Object.prototype.hasOwnProperty.call(creative.Options.buttons, row)) {
        maxCol = Math.max(maxCol, creative.Options.buttons[row].length);
      }
    }

    return maxCol;
  },
  getWidgetStyles: function(creative, size) {
    var widgetStyles = '.QSI_SocialMediaButton {position:relative;} ';
    if (size === 'Small') {
      widgetStyles += '.QSI_SocialMediaButton .Content { height: 20px; padding: 3px; } ';
    } else {
      widgetStyles += '.QSI_SocialMediaButton { height: 80px; width: 80px; } ';
    }

    // make sure button not empty
    for (var i in creative.Options.buttons) {
      if (Object.prototype.hasOwnProperty.call(creative.Options.buttons, i)) {
        var button = creative.Options.buttons[i];

        if (button) {
          switch (button.type) {
            case 'Facebook':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Facebook .Content { ' +
                  'width: 48px; height: 62px; position: absolute; top: 9px; left: 17px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Facebook .Content { width: 90px; } ';
              }
              break;
            case 'GooglePlus':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_GooglePlus .Content { ' +
                  'width: 50px; height: 60px; position: absolute; top: 11px; left: 16px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_GooglePlus .Content { width: 90px; } ';
              }
              break;
            case 'Twitter':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Twitter .Content { ' +
                  'width: 55px; height: 62px; position: absolute; top: 10px; left: 13px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Twitter .Content { width: 107px; } ';
              }
              break;
            case 'LinkedIn':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_LinkedIn .Content { ' +
                  'height: 62px; position: absolute; top: 9px; left: 11px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_LinkedIn .Content { width: 93px; } ';
              }
              break;
            case 'Reddit':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Reddit .Content { ' +
                  'width: 50px; height: 66px; position: absolute; top: 5px; left: 15px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Reddit .Content { ' +
                  'height: 17px; width: 75px; margin-top: 3px; } ';
              }
              break;
            case 'Digg':
              if (size === 'Large') {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Digg .Content { ' +
                  'width: 54px; height: 69px; position: absolute; top: 6px; left: 14px; } ';
              } else {
                widgetStyles += '.QSI_SocialMediaButton.QSI_Digg .Content { width: 76px; } ';
              }
              break;
          }
        }
      }
    }

    return widgetStyles;
  }
};QSI.CreativeManager.Utilities = {
  getImpressionURL: function(data) {
    var params = {
      'Q_Impress': 1,
      'Q_CID': data.creativeID,
      'Q_SIID': data.interceptID,
      'Q_ASID': data.asid,
      'Q_LOC': window.location.href.split('?')[0],
      'Q_CLIENTVERSION': QSI.global.clientVersion || 'unknown',
      'Q_CLIENTTYPE': QSI.global.clientType || 'unknown'
    };

    return QSI.baseURL + '?' + QSI.Orchestrator.generateQueryString(params);
  },
  // The below function should be used by future web responsive creatives.
  // Instead of adding code to the getResetStyle function, this function was created
  // in order not to break existing legacy creatives. It will also allow us to delete
  // getResetStyle completely once we deprecate the legacy creatives.
  getWebResponsiveResetStyle: function(parentElemClassName) {
    // This function returns a CSS string, applying declarations to a list of selectors
    // Params:
    // selectors: array (array of selectors)
    // declarations: string (CSS declarations to apply)
    function createCssRule(selectors, declarations) {
      if (selectors.length === 0) {
        return "";
      }
      var parentElemSelector = '.' + parentElemClassName;
      var selectorsString = "";
      for (var i = 0; i < selectors.length; i++) {
        selectorsString += parentElemSelector + " " + selectors[i] + ",";
      }
      // Slices ending comma off the end of the string
      selectorsString = selectorsString.slice(0, -1);
      return selectorsString + declarations;
    }
    var selectorsAndStyleResetsPairs = [
      {
        selectorList: [
          'div', 'dl', 'dt', 'dd', 'ul', 'ol', 'li', 'h1', 'h2', 'h3',
          'h4', 'h5', 'h6', 'span', 'pre', 'form', 'fieldset', 'textarea',
          'p', 'blockquote', 'tr', 'th', 'td'
        ],
        styleResets: '{ margin: 0; padding: 0;' +
                      'background-color: transparent; border: 0; ' +
                      'font-size: 12px; ' +
                      'line-height: normal; vertical-align:baseline; '+
                      'box-shadow: none; }'
      },
      {
        selectorList: ['img'],
        styleResets: '{ height: auto; width: auto; margin: 0; padding: 0 }'
      },
      {
        selectorList: ['ul', 'ol'],
        styleResets: '{ margin: 12px 0; padding-left: 40px; }'
      },
      {
        selectorList: ['ul li'],
        styleResets: '{ list-style-type: disc; }'
      },
      {
        selectorList: ['ol li'],
        styleResets: '{ list-style-type: decimal; }'
      },
      {
        selectorList: ['.scrollable'],
        styleResets: '{ -webkit-overflow-scrolling: touch; }'
      },
      {
        selectorList: ['table'],
        styleResets: '{ border-collapse: collapse; border-spacing: 0; }'
      },
      {
        selectorList: ['table td'],
        styleResets: '{ padding: 2px; }'
      },
      {
        selectorList: ['*'],
        styleResets: '{ box-sizing: content-box; }'
      }
    ];

    var resetStyleCssString = "";
    selectorsAndStyleResetsPairs.forEach(function(selectorStyleResetPair) {
      resetStyleCssString +=  createCssRule(selectorStyleResetPair.selectorList, selectorStyleResetPair.styleResets);
    });

    return resetStyleCssString;
  },
  getResetStyle: function(creativeType) {
    var cssTag = '.' + creativeType;

    var response = cssTag + ' div,' +
      cssTag + ' dl,' +
      cssTag + ' dt,' +
      cssTag + ' dd,' +
      cssTag + ' ul,' +
      cssTag + ' ol,' +
      cssTag + ' li,' +
      cssTag + ' h1,' +
      cssTag + ' h2,' +
      cssTag + ' h3,' +
      cssTag + ' h4,' +
      cssTag + ' h5,' +
      cssTag + ' h6,' +
      cssTag + ' pre,' +
      cssTag + ' form,' +
      cssTag + ' fieldset,' +
      cssTag + ' textarea,' +
      cssTag + ' p,' +
      cssTag + ' blockquote,' +
      cssTag + ' th,' +
      cssTag + ' td {margin: 0;padding: 0;color: black;font-family: arial;font-size: 12px;line-height: normal;}' +
      cssTag + ' ul {margin: 12px 0;padding-left: 40px;}' +
      cssTag + ' ol,' +
      cssTag + ' ul {margin: 12px 0;padding-left: 40px;}' +
      cssTag + ' ul li {list-style-type: disc;}' +
      cssTag + ' ol li {list-style-type: decimal;}' +
      cssTag + ' .scrollable {-webkit-overflow-scrolling: touch;}' +
      cssTag + ' table {border-collapse: collapse;border-spacing: 0;}' +
      cssTag + ' table td {padding: 2px;}' +
      '.QSIPopOver *,' +
      '.QSISlider *,' +
      '.QSIPopUnder *,' +
      '.QSIEmbeddedTarget * {box-sizing: content-box;}';

      return response;
  },
  hasCreativeEmbeddedTarget: function(creative) {
    if (!creative || !(creative.Options.elements) || !(creative.Options.elements.Elements)) {
      return false;
    }

    var creativeElements = creative.Options.elements.Elements;

    for (var i in creativeElements) {
      if (Object.prototype.hasOwnProperty.call(creativeElements, i)) {
        var element = creativeElements[i];

        if (element.type && element.type === 'EmbeddedTarget') {
          return true;
        }
      }
    }

    return false;
  },
  parsePipedText: function(content) {
    var expression = /\$\{(SI)?([A-Za-z]*):\/\/([^\}]*)\}/g;
    var match;
    var matches = [];
    do {
      match = expression.exec(content);
      if (match) {
        matches.push(match);
      }
    } while (match);

    return matches;
  }
};QSI.Orchestrator = {
  init: function() {
    this.setupJFEMessageEventHandlerForIOSOptimization();

    // create latency variables for tracking latency data throughout orchestrator
    QSI.global.latency = {
      si: {
        clientRequestStartTime: undefined,
        clientRequestEndTime: undefined,
        latencyStartTime: undefined,
        requestURL: undefined,
        metricID: '2'
      },
      siDPR: {
        clientRequestStartTime: undefined,
        clientRequestEndTime: undefined,
        latencyStartTime: undefined,
        requestURL: undefined,
        metricID: '3'
      }
    };

    // QSI.LoadingState is used to keep track of all Snippets that are currently loading
    if (!QSI.LoadingState) {
        QSI.LoadingState = [];
    }
    // QSI.PendingQueue keeps track of any QSI.API function that is called while snippets are loaded
    // the functions in the queue will be executed once all snippets are done loading
    if (!QSI.PendingQueue) {
        QSI.PendingQueue = [];
    }

    // set start time for latency logging
    QSI.global.latency.si.latencyStartTime = Date.now();

    if (QSI.global.legacyId) {

      if (!QSI.Request) {
        QSI.Request = {};
      }

      QSI.debug = {};

      var id = QSI.global.legacyId;
      var legacyParams = { id: id };

      if (id.indexOf('ZN') === 0) {
        legacyParams.ZoneID = id;
      } else {
        legacyParams.InterceptID = id;
      }

      var qsParams;
      if (QSI.global.isHostedJS()) {
        qsParams = QSI.Orchestrator.parseQueryString(window.location.href);

        if (typeof qsParams.Q_DEBUG !== 'undefined' || QSI.config.debug) {
          legacyParams.Q_DEBUG = null;
          QSI.initFullDbg();
        }

        if(QSI.config.editing || QSI.global.version === '0') {
          legacyParams.version = '0';
        }
      }
      else {
        // Retrieve a reference to this script to determine nocache, bookmarklet, debug, version
        var legacyScript;

        if (document.currentScript) {
          legacyScript = document.currentScript.src;
        } else {
          try {
            // Fallback for IE
            var rawScripts = document.querySelectorAll('script');
            var legacyScripts = [];

            for (var j in rawScripts) {
              if (Object.prototype.hasOwnProperty.call(rawScripts, j)) {
                legacyScripts[j] = rawScripts[j];
              }
            }

            var sieBaseUrl = QSI.global.baseURL;
            if (sieBaseUrl.indexOf('https://') === 0) {
              sieBaseUrl = sieBaseUrl.substring(8);
            } else if (sieBaseUrl.indexOf('http://') === 0) {
              sieBaseUrl = sieBaseUrl.substring(7);
            } else if (sieBaseUrl.indexOf('//') === 0) {
              sieBaseUrl = sieBaseUrl.substring(2);
            }
            var siScripts = legacyScripts.filter(function(o) {
              if (o.src.indexOf(sieBaseUrl + '/WRSiteInterceptEngine/?') !== -1 || o.src.indexOf(sieBaseUrl + '/SIE/?') !== -1) {
                return o.src.indexOf('Q_Impress') === -1 && o.src.indexOf('Q_Redirect') === -1 &&
                  o.src.indexOf('Q_Click') === -1 && o.src.indexOf('Q_DPR') === -1;
              }
              return false;
            });

            legacyScript = siScripts[0].src;
          } catch (e) {
            QSI.dbg.e('An error occurred while loading the intercept.', e);
          }

        }

        qsParams = QSI.Orchestrator.parseQueryString(legacyScript);

        // Copy over relevant querystring parameters for use on SIE requests (querystring key:value)
        if (typeof qsParams.Q_NOCACHE !== 'undefined') {
          legacyParams.Q_NOCACHE = null;
        }

        if (typeof qsParams.Q_BOOKMARKLET !== 'undefined') {
          legacyParams.Q_BOOKMARKLET = null;
          legacyParams.Q_DEBUG = null;
          QSI.initFullDbg();
        }

        if (typeof qsParams.Q_DEBUG !== 'undefined') {
          legacyParams.Q_DEBUG = null;
          QSI.initFullDbg();
        }

        if (typeof qsParams.Q_VERSION !== 'undefined') {
          legacyParams.version = qsParams.Q_VERSION;
        }
      }

      if (typeof QSI.global.clientVersion !== 'undefined' && QSI.global.clientVersion !== null) {
        legacyParams.Q_CLIENTVERSION = QSI.global.clientVersion;
      }

      if (typeof QSI.global.clientType !== 'undefined' && QSI.global.clientType !== null) {
        legacyParams.Q_CLIENTTYPE = QSI.global.clientType;
      }

      QSI.Orchestrator.load(legacyParams);
    } else {
      if (!QSI.Request) {
        QSI.Request = {};

        var scripts = document.querySelectorAll('[data-siteinterceptscript]');

        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];

          // Determine debug
          QSI.isDebug = QSI.isDebug || script.hasAttribute('data-qdebug') || window.location.href.indexOf('Q_DEBUG') !== -1;

          if (QSI.isDebug) {
            QSI.initFullDbg();
          }

          // Parse input
          var params = {};

          if (script.hasAttribute('data-interceptid')) {
            params.InterceptID = script.getAttribute('data-interceptid');
            params.id = params.InterceptID;
          }

          if (script.hasAttribute('data-zoneid')) {
            params.ZoneID = script.getAttribute('data-zoneid');
            params.id = params.ZoneID;
          }

          if (script.hasAttribute('data-qnocache')) {
            params.Q_NOCACHE = null;
          }

          if (script.hasAttribute('data-qbookmarklet')) {
            params.Q_BOOKMARKLET = null;
          }

          if (QSI.isDebug) {
            params.Q_DEBUG = null;
          }

          if (script.hasAttribute('data-version')) {
            params.version = script.getAttribute('data-version');
          }

          QSI.Orchestrator.load(params);
        }
      }
    }
  },
  load: function(params) {
    QSI.LoadingState.push(true);
    QSI.global.latency.si.requestURL = QSI.Orchestrator.generateTargetingURL(params);
    QSI.global.latency.si.clientRequestStartTime = Date.now();
    var targetingPromise = QSI.AssetManager.promiseFetch('GET', QSI.global.latency.si.requestURL);

    QSI.Request[params.id] = {};
    QSI.Request[params.id].Intercepts = {};
    QSI.Request[params.id].Params = params;

    targetingPromise.then(function() {
        QSI.global.latency.si.clientRequestEndTime = Date.now();
    }).then(QSI.Orchestrator.handleTargetingResponse.bind(null, params), function(error) {
      QSI.dbg.e('An error occurred while loading the intercept. ' + error.Message ? error.Message : error);
      if (params.deferred) {
        params.deferred.reject();
      }
    });
  },
  generateTargetingURL: function(inputParams) {
    var baseURL = QSI.baseURL + 'Targeting.php?';
    var params = [];

    if (inputParams.InterceptID) {
      params.push('Q_InterceptID=' + inputParams.InterceptID);
    }

    if (inputParams.ZoneID) {
      params.push('Q_ZoneID=' + inputParams.ZoneID);
    }

    params.push('Q_LOC=' + encodeURIComponent(window.location.href));

    if (inputParams.Q_DEBUG === null) {
      params.push('Q_DEBUG');
      QSI.isDebug = true;
    }

    if (inputParams.Q_BOOKMARKLET === null) {
      params.push('Q_BOOKMARKLET');
    }

    if (inputParams.Q_NOCACHE === null) {
      params.push('Q_NOCACHE');
    }

    if (typeof inputParams.version !== 'undefined' && inputParams.version !== null) {
      params.push('Version=' + inputParams.version);
    }

    var surveyTaken = QSI.profile.get("QualtricsSurveyHistory","",1);
    if(surveyTaken) {
      var surveys = encodeURIComponent(Object.keys(surveyTaken));
      params.push("Q_QualtricsSurveyTaken=" + surveys);
    }

    if (typeof inputParams.Q_CLIENTVERSION !== 'undefined' && inputParams.Q_CLIENTVERSION !== null) {
      params.push('Q_CLIENTVERSION=' + inputParams.Q_CLIENTVERSION);
    }

    if (typeof inputParams.Q_CLIENTTYPE !== 'undefined' && inputParams.Q_CLIENTTYPE !== null) {
      params.push('Q_CLIENTTYPE=' + inputParams.Q_CLIENTTYPE);
    }

    return baseURL + params.join('&');
  },
  isMessageEventOriginAllowed: function(origin) {
    if (QSI.reg && QSI.reg instanceof Object) {
      for (var index in QSI.reg) {
        if (Object.prototype.hasOwnProperty.call(QSI.reg, index)) {
          if (QSI.reg[index] && QSI.reg[index].options && QSI.reg[index].options.targetURLOrigin && QSI.reg[index].options.targetURLOrigin === origin) {
            return true;
          }
        }
      }
    }
    if(QSI.dbg && QSI.dbg.c) {
      QSI.dbg.c("Event origin is not allowed: " + origin);
    }
    return false;
  },
  handleTargetingResponse: function(params, response) {
    try {
      var siResponse = '';

      // this is the response sent if the request was rejected due to server-side sampling
      if (response === 'SampleRejected') {
        return;
      }
      try {
        siResponse = JSON.parse(response);
      } catch(e) {
         QSI.dbg.e('Failed to parse JSON of targeting response: ' + response);
         return;
      }

      if (siResponse.Error) {
        QSI.dbg.e(siResponse.Message);
        return;
      }

      QSI.Orchestrator.setGlobalVars(siResponse);

      QSI.Orchestrator.setupDBGLog();

      var modules = siResponse.Modules;

      // Load the core modules
      if (modules.Core) {
        var corePromise = QSI.AssetManager.promiseLoadScript('Core', modules.Core);

        corePromise.then(
          function success () {
            try {
              QSI.history.logVisit();

              if (siResponse.Intercepts) {
                for (var i = 0; i < siResponse.Intercepts.length; i++) {
                  var intercept = siResponse.Intercepts[i];

                  if (intercept) {
                    if (intercept.Error) {
                      QSI.dbg.log(intercept.Message);
                    } else {
                      QSI.Request[params.id].Intercepts[intercept.InterceptID] = {};
                      QSI.Request[params.id].Intercepts[intercept.InterceptID].Targeting = intercept;
                    }
                  }
                }
              }

              if (QSI.Request[params.id].hasDependencies || !QSI.Request[params.id].hasBeenResolved) {
                QSI.EventTracker.trackElements();
                QSI.EventTracker.incrementEventList();
                window._qsie = QSI.API.Events;
              }

              if (siResponse.Dependencies) {
                // set DPR start time
                QSI.global.latency.siDPR.latencyStartTime = Date.now();
                QSI.Orchestrator.handleDependencyResolver(params, siResponse);
              } else {
                QSI.Orchestrator.loadModules(params, siResponse);
              }
            } catch (e) {
              QSI.dbg.e(e);
            }
          },
          function failure() {
            // In case of script load failure, do nothing and abort execution.
            // promiseLoadScript already uses QSI.dbg.e to log an error message
            // about the failure.
          });
      } else{
        QSI.Orchestrator.doneLoading(params);
      }
    } catch (e) {
      QSI.dbg.e(e);
    }
  },

  setupDBGLog: function() {
    if (QSI.dbg) {
      QSI.dbg.log = function(message, includeStackTrace, levelName) {
        if (QSI.ClientLog) {
          if (QSI.global.featureFlags.isClientLoggingEnabled) {
            QSI.ClientLog.send(message, includeStackTrace, levelName);
          } else {
            var samplingPercentage = 0.02;
            QSI.ClientLog.sampledSend(message, includeStackTrace, levelName, samplingPercentage);
          }
        }
      };
    }
  },

  handleDependencyResolver: function(params, siResponse) {
    var url = QSI.Orchestrator.generateTargetingURL(params);
    url += '&t=' + (new Date()).getTime();
    url += '&Q_VSI=' + encodeURIComponent(JSON.stringify(siResponse.RequestData.validIntercepts));
    url += '&Q_DPR=true';

    QSI.global.latency.siDPR.requestURL = url;
    QSI.global.latency.siDPR.clientRequestStartTime = Date.now();

    var postData = '';

    for (var type in siResponse.Dependencies) {
      if (Object.prototype.hasOwnProperty.call(siResponse.Dependencies, type)) {
        if (type === 'SiteCatalyst') {
          QSI['Resolve' + type].rootName = QSI.adobeVar;
        }
        postData += QSI['Resolve' + type].prepare(siResponse.Dependencies[type]);
      }
    }

    var dprPromise = QSI.AssetManager.promiseFetch('POST', url, postData);

    dprPromise.then(function() {
        QSI.global.latency.siDPR.clientRequestEndTime = Date.now();
    }).then(QSI.Orchestrator.handleTargetingResponse.bind(this, params), function(error) {
      QSI.dbg.e('An error occurred while loading the intercept. ' + error.Message ? error.Message : error);
      if (params.deferred) {
        params.deferred.reject();
      }
    });
  },
  loadModules: function(params, siResponse) {
    var promises = [];
    var modules = siResponse.Modules;

    for (var module in modules) {
      if (Object.prototype.hasOwnProperty.call(modules, module)) {
        //we don't want to load screen capture unless we need it, but we can't remove it from the response because of hosted
        if (module === 'ScreenCapture') {
          QSI.Orchestrator.setupScreenCaptureListener(modules[module]);
          continue;
        }

        if ((module === 'HTTPRedirect' || module === 'LatencyLog') && QSI.global.isHostedJS()) {
          QSI.dbg.c("Module type '" + module + "' is not supported when using Site Intercept Hosted JS");
          continue;
        }

        var modulePromise = QSI.AssetManager.promiseLoadScript(module, modules[module]);
        promises.push(modulePromise);
      }
    }

    for (var i = 0; i < siResponse.Intercepts.length; i++) {
      var intercept = siResponse.Intercepts[i];

      if (intercept && !intercept.Error && intercept.Decision.ActionSetID !== null) {
        var interceptPromise = QSI.AssetManager.promiseLoadIntercept(params.id, intercept, params);
        var creativePromise = QSI.AssetManager.promiseLoadCreative(params.id, intercept, params);

        promises.push(interceptPromise, creativePromise);

        if (intercept.Decision.PopUnderTarget && intercept.Decision.PopUnderTarget.ID &&
          intercept.Decision.PopUnderTarget.ID !== 'Target') {

          var popUnderTargetPromise = QSI.AssetManager.promiseLoadPopUnderTarget(params.id, intercept, params);
          promises.push(popUnderTargetPromise);
        }
      }
    }

    QSI.Orchestrator.when.apply(this, promises).then(function() {
      try {
        // end time
        var samplingPercentage = 0.02; // Sampling Rate set to 0.02% to get ~1000 logs per hour
        if (QSI.global.featureFlags.isLatencyLoggingEnabled && QSI.global.latency && (params.loadingFromAPI !== true)) {

          var latencyTrackers = [
            QSI.global.latency.si,
            QSI.global.latency.siDPR
          ];

          latencyTrackers.forEach(function(latencyTracker) {
            if (!latencyTracker) {
              return;
            }
            if (typeof latencyTracker.latencyStartTime === 'number') {
              var latencyTime = Date.now() - latencyTracker.latencyStartTime;
              var clientLatencyTime;
              if (typeof latencyTracker.clientRequestEndTime === 'number' && typeof latencyTracker.clientRequestStartTime === 'number') {
                clientLatencyTime = latencyTracker.clientRequestEndTime - latencyTracker.clientRequestStartTime;
              }
              QSI.LatencyLog.sampledSend(latencyTime,clientLatencyTime, latencyTracker.metricID, latencyTracker.requestURL, samplingPercentage);
            }
          });
        }

        QSI.Orchestrator.prepareIntercepts(params, siResponse);
      } catch (e) {
        QSI.dbg.e(e);
      }
    }, function(error) {
      var errorMessage = '';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error.Message === 'string') {
        errorMessage = error;
      }
      QSI.dbg.e('An error occurred while loading the intercept. ' + errorMessage);
      if (params.deferred) {
        params.deferred.reject();
      }
    });
  },
  setInterceptDisplayOptionCallback: function(displayInterceptType, interceptCallback) {
    switch(displayInterceptType) {
      case '':
      case 'onfocus':
        QSI.util.waitForFocus().done(interceptCallback);
        break;
      case 'onload':
        interceptCallback();
        break;
      case 'onexit':
        QSI.util.waitForExitIntent().done(interceptCallback);
        break;
      default:
        return;
    }
  },
  prepareIntercepts: function(params, siResponse) {
    QSI.Orchestrator.setGlobalIncludes(params, siResponse);

    var displayInterceptType = QSI.Request[params.id].displayInterceptType;

    // TODO: don't think we need this anymore because JSON is built in to
    // all browsers wer support.  Remove and test across our supported browsers
    // https://qualtrics.atlassian.net/browse/SI-2639
    if (typeof JSON === 'undefined') {
      var loader = new QSI.util.ScriptLoader(QSI.global.modulePath);
      loader.load('JSONParseModule.js').done(function() {
        if (!(displayInterceptType === 'manual' || QSI.Request[params.id].zoneManualDisplay)) {
          if (!QSI.Request[params.id].hasDependencies) {
            QSI.Orchestrator.setInterceptDisplayOptionCallback(displayInterceptType,
                QSI.RunIntercepts.bind(null, params.id, false));
          } else {
            QSI.RunIntercepts(params.id, false);
          }
        }
      });
    } else if (!(displayInterceptType === 'manual' || QSI.Request[params.id].zoneManualDisplay) ||
      QSI.Request[params.id].hasDependencies) {
        QSI.RunIntercepts(params.id, false);
    }
    QSI.Orchestrator.doneLoading(params);
    // Resolve promise, if one was passed in
    if (params.deferred) {
      params.deferred.resolve();
    }
  },
  setGlobalIncludes: function(params, siResponse) {
    if (QSI.isDebug) {
      QSI.Request[params.id].Debug = {
        debugInfo: JSON.parse(siResponse.DebugInfo),
        version: siResponse.RequestData.bVersion
      };
      QSI.debug.version = siResponse.RequestData.bVersion;
      QSI.debug.debugInfo = JSON.parse(siResponse.DebugInfo);
    }

    QSI.version = siResponse.RequestData.bVersion;
    QSI.InterceptsRan = false;

    QSI.Request[params.id].hasDependencies = siResponse.RequestData.hasDependencies;
    QSI.Request[params.id].hasBeenResolved = siResponse.RequestData.hasBeenResolved;
    QSI.Request[params.id].displayInterceptType = siResponse.RequestData.displayInterceptType;
    QSI.Request[params.id].zoneManualDisplay = siResponse.RequestData.zoneManualDisplay;
  },
  setGlobalVars: function(siResponse) {
    QSI.Browser = {
      name: siResponse.RequestData.browser,
      version: siResponse.RequestData.browserVersion,
      isMobile: siResponse.RequestData.isMobile,
      isBrowserSupported: siResponse.RequestData.isBrowserSupported
    };

    QSI.CORSOrigin = siResponse.RequestData.CORSOrigin;

    QSI.OS = {
      name: siResponse.RequestData.osName
    };

    QSI.global.brandID = siResponse.RequestData.brandID;
    QSI.global.brandDC = siResponse.RequestData.brandDC;
    if (QSI.global.isHostedJS()) {
      QSI.global.graphicPath = 'https://' + QSI.global.brandDC +'/WRQualtricsSiteIntercept/Graphic.php?IM=';
      QSI.global.imagePath = 'https:' + QSI.global.baseURL + '/WRSiteInterceptEngine/../WRQualtricsShared/Graphics/';
    }
    QSI.global.maxCookieSize = siResponse.RequestData.maxCookieSize;

    QSI.global.featureFlags = siResponse.FeatureFlags;
    QSI.global.screenCaptureServiceBaseURL = siResponse.RequestData.screenCaptureServiceBaseURL;
    QSI.global.eventTrackers = siResponse.RequestData.eventTrackers;

    QSI.adobeVar = siResponse.RequestData.adobeSCVariable;

    // This is used by IE to get the stored user data off the storage element
    QSI.id = siResponse.RequestData.ID;

    QSI.reqID[siResponse.RequestData.ID] = true;

    QSI.CookieDomain = siResponse.RequestData.cookieDomain;
    QSI.currentURL = window.location.href.split('?')[0];

    (function() {
      // Create the measurement node
      var scrollDiv = document.createElement("div");
      scrollDiv.className = "scrollbar-measure";
      scrollDiv.style.width = '100px';
      scrollDiv.style.height = '100px';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-99999px';
      document.body.appendChild(scrollDiv);

      // Get the scrollbar width
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      QSI.scrollbarWidth = scrollbarWidth; // Mac:  15

      // Delete the DIV
      document.body.removeChild(scrollDiv);
    })();
  },
  parseQueryString: function(url) {
    var options = {};

    if (url && url.indexOf('?') !== -1) {
      var queryString = url.split("?", 2)[1];
      queryString = queryString.split("&");

      for (var i = 0; i < queryString.length; i++) {
        var option = queryString[i].split("=", 2);

        if (option[0] === 'Q_LOC' &&
          option[1].indexOf('Q_DEBUG') !== -1) {
          options.Q_DEBUG = true;
        }

        if(option[0]) {
          options[option[0]] = decodeURIComponent(option[1]);
        }
      }
    }

    return options;
  },
  generateQueryString: function(options) {
    var qsOptions = [];

    for (var i in options) {
      if (Object.prototype.hasOwnProperty.call(options, i)) {
        var optString = i;
        if (options[i]) {
          optString += '=' + encodeURIComponent(options[i]);
        }
        qsOptions.push(optString);
      }
    }

    return qsOptions.join("&");
  },
  getClientVersionQueryString: function() {
    return QSI.Orchestrator.generateQueryString({
      Q_CLIENTVERSION: QSI.global.clientVersion || 'unknown',
      Q_CLIENTTYPE: QSI.global.clientType || 'unknown'
    });
  },
  replaceAll: function(str, value, replacement) {
    value = value.replace(/([.*+?^${}()|\[\]\\=!:\/])/g, "\\$1");
    return str.replace(new RegExp(value, 'g'), replacement);
  },
  Deferred: function() {
    var deferred = {},
        state = 'pending',
        resolvedArgs = [],
        rejectedArgs = [],
        resolveCallbacks = [],
        rejectCallbacks = [];
    var promise = {
      state: function() {
        return state;
      },
      then: function(doneCallback, failCallback) {
        this.done(doneCallback).fail(failCallback);
        return this;
      },
      done: function(callback) {
        if (state === 'pending') {
          resolveCallbacks.push(callback);
        } else if (state === 'resolved') {
          try {
            callback.apply(this, resolvedArgs);
          } catch(e) {
            if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
              QSI.dbg.e(e);
            }
          }
        }
        return this;
      },
      fail: function(callback) {
        if (state === 'pending') {
          rejectCallbacks.push(callback);
        } else if (state === 'rejected') {
          try {
            callback.apply(this, rejectedArgs);
          } catch(e) {
            if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
              QSI.dbg.e(e);
            }
          }
        }
        return this;
      },
      promise: function() {
        return promise;
      }
    };
    QSI.Orchestrator.forOwn(promise, function(value, funcName) {
      deferred[funcName] = promise[funcName];
    });
    deferred.resolve = function() {
      if (state === 'pending') {
        state = 'resolved';
        var args = QSI.Orchestrator.createArrayFromArguments(arguments);
        resolvedArgs = args;
        var that = this;
        QSI.Orchestrator.each(resolveCallbacks, function(callback) {
          try {
            callback.apply(that, args);
          } catch(e) {
            if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
              QSI.dbg.e(e);
            }
          }
        });
      }
    };
    deferred.reject = function() {
      if (state === 'pending') {
        state = 'rejected';
        var args = QSI.Orchestrator.createArrayFromArguments(arguments);
        rejectedArgs = args;
        var that = this;
        QSI.Orchestrator.each(rejectCallbacks, function(callback) {
          try {
            callback.apply(that, args);
          } catch(e) {
            if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
              QSI.dbg.e(e);
            }
          }
        });
      }
    };
    return deferred;
  },
  when: function(childDeferred) {
    var deferreds = QSI.Orchestrator.createArrayFromArguments(arguments),
        length = deferreds.length,
        remaining = length,
        deferred = remaining === 1 ? childDeferred : QSI.Orchestrator.Deferred(),
        update = function(i, values) {
          return function(value) {
            values[i] = arguments.length > 1 ? value : QSI.Orchestrator.createArrayFromArguments(arguments);
            if (!(--remaining)) {
              deferred.resolve(values);
            }
          };
        };

    if (length > 1) {
      for (var i = 0; i < length; i++) {
        if (deferreds[i] && deferreds[i].promise) {
          deferreds[i].promise()
            .done(update(i, deferreds))
            .fail(deferred.reject);
        }
        else {
          remaining--;
        }
      }
    }

    if (remaining < 1) {
      deferred.resolve(deferreds);
    }

    return deferred.promise();
  },
  //From prototype.js
  createArrayFromArguments: function(iterable) {
    if (!iterable) {
      return [];
    }
    return Array.prototype.slice.call(iterable);
  },
  isFunction: function(a) {
    return typeof a === 'function' || false;
  },
  forOwn: function(obj, callback) {
    // TODO add check for callback
    if (obj && obj instanceof Object && this.isFunction(callback)) {
      for (var index in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, index)) {
          callback(obj[index], index, obj);
        }
      }
    }
  },
  each: function(array, callback) {
    var length = array.length;
    if (length) {
      for (var i = 0; i < length; i++) {
        callback(array[i], i);
      }
    }
  },
  doneLoading: function(params) {
    // SI resources finished loading so remove one loading flag from the array
    QSI.LoadingState.pop();

    // if all snippets are done loading then emit event and execute API functions that are in the queue
    if (QSI.LoadingState.length === 0) {
      // if load was triggered by the Snippet code and not from QSI.API.load()
      // then emit event notifying that SI finishes loading all resources
      if (params.loadingFromAPI !== true) {
        var loadingEvent = document.createEvent("Event");
        loadingEvent.initEvent("qsi_js_loaded", true, true);
        window.dispatchEvent(loadingEvent);
      }

      var length = QSI.PendingQueue.length;
      for (var i = 0; i < length; i++) {
        var func = QSI.PendingQueue.shift();
        func();
      }
    }
  },
  // iOS Browsers have quirks when the embedded target is a JFE survey.
  // See SI-1905 and SI-2820 for more information.
  setupJFEMessageEventHandlerForIOSOptimization: function () {
    if (!QSI.JFEListenerRegistered) {
      QSI.JFEListenerRegistered = true;
      var isSurveyIFrameOnIOS = function(msgData) {
        var data = null;
        if (typeof msgData === 'string') {
          try {
            data = JSON.parse(msgData);
          } catch(e) {
            return false;
          }
        }

        return (
          data !== null &&
          data.from === 'JFE' &&
          data.to === 'SI' &&
          data.event === 'JFELoaded' &&
          QSI.OS.name === 'iOS'
        );
      };

      // By informing the surveys that they're being viewed through
      // <iframe>s on iOS, it will optimize their CSS for
      // iOS. The surveys are black-boxed b/c of CORS,
      // so we must communicate with them via postMessage.
      var informSurveyIFrameOfIOS = function(iframeWindow, iframeOrigin) {
        iframeWindow.postMessage({
          event: 'addIOSSIWorkaround',
          from: 'SI',
          to: 'JFE'
        }, iframeOrigin);
      };

      // When should we postMessage to the survey? If we do it before the survey fully
      // loads, it won't work b/c the corresponding event listener isn't setup yet.
      // We should do it after the survey fully loads. But how do we know when the
      // survey fully loads? We can't do 'iframe.onload' b/c our surveys are SPAs.
      // 'iframe.onload' would correspond to the 'onload' of the survey's
      // SPA-javascript. But we need to know when the SPA-javascript has finished
      // executing -- that is the 'true onload'. Currently, we have JFE send us
      // a 'canScreenCapture' event when the survey truly loads. Originally, this
      // event was specifically for screencapture-related purposes. However, because
      // it's always sent on survey true-load, we can use it as well. In the future,
      // we will generalize the 'canScreenCapture' event's name to 'surveyHasLoaded',
      // or something similar for better semantics. See SI-2987 for more information.
      return window.addEventListener('message', function(event) {
        try {
          if (QSI.Orchestrator && QSI.Orchestrator.isMessageEventOriginAllowed && !QSI.Orchestrator.isMessageEventOriginAllowed(event.origin)) {
            return;
          }
          if (isSurveyIFrameOnIOS(event.data)) {
            informSurveyIFrameOfIOS(event.source, event.origin);
          }
        } catch (e) {
          if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
            QSI.dbg.e(e);
          }
        }
      });
    }
  },
  setupScreenCaptureListener: function(version) {
    if (!QSI.screenCaptureListenerRegistered) {
      QSI.screenCaptureListenerRegistered = true;

      // listens for post messages from survey iframes
      // This return does nothing for the code, but makes it testable
      return window.addEventListener("message", function(event) {
        try {
          console.log('======QSI START MESSAGE LISTENER in setupScreenCaptureListener========');
          console.log('    message received at: ' + Date.now());
          console.log('    event.origin is:' + event.origin);
          if (QSI.Orchestrator && QSI.Orchestrator.isMessageEventOriginAllowed && !QSI.Orchestrator.isMessageEventOriginAllowed(event.origin)) {
            console.log('        event.origin is NOT allowed');
            return;
          }
            console.log('        event.origin is allowed');

          // gets the intercept that contains the embedded target that the message originated from
          var intercept = QSI.util.getOriginInterceptOfMessage(event.source);

          // if intercept is null, then the message did not originate from the embedded target
          // of an intercept and we should just ignore it.  This check is also our security.
          // We won't post screen capture data back  to a source unless it's the embedded target
          // of one of the registered intercepts on the page
          if (!intercept) {
            console.log('    event.source is NOT allowed');
            return;
          }
          console.log('    event.source is allowed');

          var messageObject = event.data;
          console.log('    event.data: ' + event.data);
          if (typeof messageObject === 'string') {
            try {
              messageObject = JSON.parse(messageObject);
            } catch (e) {
              console.log('        event.data could not be parsed');

              return;
            }
          }

          if (!messageObject || messageObject.from !== 'JFE' || messageObject.to !== 'SI') {
            console.log('        event.data does not have correct sender/destination');
            return;
          }
            console.log('        event.data is good');

          if (!QSI.screenCaptureHandlers) {
            QSI.screenCaptureHandlers = {};
          }

          // let's the embedded target know that it is contained by an intercept that can handle
          // screen capture requests
          if (messageObject.event === 'canScreenCapture') {
            console.log('    handling action: canScreenCapture');

            if (typeof QSI.screenCaptureModulePromise === 'undefined') {
              console.log('    requesting screencapture module');

              QSI.screenCaptureModulePromise = QSI.AssetManager.promiseLoadScript('ScreenCapture', version);
            }

            var canScreenCaptureMessage = {
              event: 'canScreenCapture',
              from: 'SI',
              to: 'JFE',
              canScreenCapture: true
            };
            console.log('    sending reply postMessage for canScreenCapture');

            event.source.postMessage(JSON.stringify(canScreenCaptureMessage), event.origin);
            console.log('    after sending reply postMessage for canScreenCapture');
            console.log('======QSI END MESSAGE LISTENER in setupScreenCaptureListener========');

            return;
          }

          console.log('    other kind of action');
          console.log('======QSI END MESSAGE LISTENER in setupScreenCaptureListener========');

          if (typeof QSI.screenCaptureModulePromise !== 'undefined') {
            QSI.screenCaptureModulePromise.then(function() {
              if (!QSI.screenCaptureHandlers[messageObject.sessionId]) {
                QSI.screenCaptureHandlers[messageObject.sessionId] = new QSI.ScreenCaptureHandler(intercept, event.source, messageObject.sessionId, messageObject.translations, event.origin);
              }

              switch (messageObject.event) {
                case 'startScreenCapture':
                  QSI.screenCaptureHandlers[messageObject.sessionId].captureScreen(messageObject.questionId);
                  break;

                case 'editScreenCapture':
                  QSI.screenCaptureHandlers[messageObject.sessionId].editAnnotations(messageObject.questionId);
                  break;

                case 'removeScreenCapture':
                  QSI.screenCaptureHandlers[messageObject.sessionId].removeScreenCapture(messageObject.questionId);
                  break;

                case 'sessionFinished':
                  QSI.screenCaptureHandlers[messageObject.sessionId].removeAllScreenCaptures();
                  break;

                default:
                  return;
              }
            });
          }
        } catch (e) {
          if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
            QSI.dbg.e(e);
          }
        }
      });
    }
  }
};QSI.RunIntercepts = function(siid, calledFromAPI) {
  if (typeof siid === 'undefined') {
    siid = null;
  }
  QSI.util.observe(window, 'message', function(e) {
    try {
      if (QSI.Orchestrator && QSI.Orchestrator.isMessageEventOriginAllowed && !QSI.Orchestrator.isMessageEventOriginAllowed(e.origin)) {
        return;
      }
      if (e.data && typeof e.data === 'string') {
        var parts = e.data.split('|');
        if (parts[0] === 'QualtricsEOS') {
          var sid = parts[1];
          var ssid = parts[2];
          QSI.history.logSurvey(sid, ssid);
        }
      }
    } catch(ex) {
      if (typeof QSI !== 'undefined' && QSI.dbg && QSI.dbg.e) {
        QSI.dbg.e(ex);
      }
    }
  });

  // Outputs
  var interceptsToRun = siid ? [siid] : Object.keys(QSI.Request);

  for (var i = 0; i < interceptsToRun.length; i++) {
    for (var interceptID in QSI.Request[interceptsToRun[i]].Intercepts) {
      if (Object.prototype.hasOwnProperty.call(QSI.Request[interceptsToRun[i]].Intercepts, interceptID)) {
        var intercept = QSI.Request[interceptsToRun[i]].Intercepts[interceptID];

        // Only show intercept if it's not already active
        if (!QSI.reg[interceptID]) {
          QSI.history.logIntercept(interceptID, intercept.Targeting.Decision.ActionSetID);
          intercept.siid = interceptsToRun[i];

          var interceptDisplayType;
          if (intercept.Intercept) {
            var displayOptions = intercept.Intercept.DisplayOptions;
            if (typeof displayOptions.displayInterceptType !== 'undefined') {
              interceptDisplayType = displayOptions.displayInterceptType;

            // manualDisplay is a legacy variable we used in our intercept definitions
            // before we had displayInterceptType and should be respected if
            // displayInterceptType is not in the definition.  manualDisplay=true is
            // equivalent to displayInterceptType=manual and manualDisplay=false is
            // equivalent to displayInterceptType=onload
            } else if (displayOptions.manualDisplay === true) {
              interceptDisplayType = 'manual';
            } else {
              interceptDisplayType = 'onload';
            }
          }

          // There is no else condition here because if we did we can run into the case where an Intercept may run twice when it shouldn't.
          // There are cases when RunIntercepts is called but we dont want to run any intercept.
          // For example, if you have an onExit intercept and you call QSI.API.load().then(QSI.API.run),
          // the load will setInterceptDisplayOptionCallback to wait for waitForExitIntent and when the exit intent triggers
          // then it will display, but then if QSI.API.run() gets called before the intercept is displayed it will do the same thing
          // so you can have the exit Intent Intercept display twice. By implementing it this way we ensure it only displays once.
          if (!calledFromAPI || (QSI.Request[interceptsToRun[i]].zoneManualDisplay && interceptDisplayType !== 'manual')) {
            QSI.Orchestrator.setInterceptDisplayOptionCallback(interceptDisplayType,
                QSI.RunIntercept.bind(null, interceptID, intercept));

          } else if (interceptDisplayType === 'manual') {
            QSI.RunIntercept(interceptID, intercept);
          }
        }
      }
    }

    if (QSI.isDebug && !QSI.debuggerHasDisplayed) {
      new QSI.DebugHandler(QSI.Request[interceptsToRun[i]].Debug);
      QSI.debuggerHasDisplayed = true;
    }
  }

  var ResolvedEvent = document.createEvent('Event');
  ResolvedEvent.initEvent('Resolved', true, true);
  document.body.dispatchEvent(ResolvedEvent);
};


QSI.Orchestrator.addPopUnderTarget = function(interceptData, popUnderDefinition) {
  popUnderDefinition.Options.width = popUnderDefinition.Options.baseElement.style.width;
  popUnderDefinition.Options.height = popUnderDefinition.Options.baseElement.style.height;
  popUnderDefinition.Options.helperScriptSrc = QSI.baseURL + 'Orchestrator.php';

  var helperOptions = {
    onPopForwardShowTarget: popUnderDefinition.Options.showTargetOnPopForward,
    showOnPageChange: popUnderDefinition.Options.showOnPageChange,
    showOnSiteExit: popUnderDefinition.Options.showOnSiteExit,
    checkThreshold: 3,
    watchInterval: 1000,
    targetWidth: interceptData.actionSet.ActionOptions.targetWidth,
    targetHeight: interceptData.actionSet.ActionOptions.targetHeight,
    targetFullScreen: interceptData.actionSet.ActionOptions.targetFullScreen,
    impressionURL: QSI.CreativeManager.Utilities.getImpressionURL(interceptData)
  };

  interceptData.actionSet.ActionOptions.targetPopUnderDisplay.creative = {
    elements: popUnderDefinition.Options.elements,
    resetStyle: QSI.CreativeManager.Utilities.getResetStyle('QSIPopUnder'),
    popunderOptions: popUnderDefinition.Options,
    popunderHelperOptions: helperOptions
  };
};

QSI.RunIntercept = function(interceptID, data) {
  try {
    if (data.Targeting.Decision.ActionSetID === undefined || data.Targeting.Decision.ActionSetID === null) {
      return;
    }

    var actionSet = data.Intercept.ActionSets[data.Targeting.Decision.ActionSetID];

    (function() {
      var embeddedData = actionSet.EmbeddedData;
      if (!QSI.ed[interceptID] || (embeddedData && embeddedData.length !== 0)) {
        QSI.ed[interceptID] = embeddedData;
      }
    })();

    QSI.global.intercepts[interceptID] = {
      CreativeID: data.Targeting.Decision.Creative.ID,
      ASID: data.Targeting.Decision.ActionSetID
    };

    // Object passed to the CreativeManager handler
    var interceptData = {
      id: data.siid,
      interceptID: data.Targeting.InterceptID,
      intercept: data.Intercept,
      actionSet: data.Intercept.ActionSets[data.Targeting.Decision.ActionSetID],
      creative: data.Creative,
      decision: data.Targeting.Decision,
      params: QSI.Request[data.siid].Params
    };

    // Inject server-side locators
    var locatorValues = data.Targeting.Decision.Creative.LocatorValues;
    if (locatorValues) {
      for (var locatorKey in locatorValues) {
        if(Object.prototype.hasOwnProperty.call(locatorValues, locatorKey)) {
          var locatorValue = locatorValues[locatorKey];

          if (data.Creative.Options && data.Creative.Options.content) {
            data.Creative.Options.content = QSI.Orchestrator.replaceAll(data.Creative.Options.content, locatorKey, locatorValue);
          }

          if (data.Creative.Options && data.Creative.Options.html) {
            data.Creative.Options.html = QSI.Orchestrator.replaceAll(data.Creative.Options.html, locatorKey, locatorValue);
          }

          if (data.Creative.Options && data.Creative.Options.elements) {
            for (var i in data.Creative.Options.elements.Elements) {
              if (Object.prototype.hasOwnProperty.call(data.Creative.Options.elements.Elements, i)) {
                var element = data.Creative.Options.elements.Elements[i];
                element.content = QSI.Orchestrator.replaceAll(element.content, locatorKey, locatorValue);
              }
            }
          }
        }
      }
    }

    // Inject server-side anchor tags
    var anchorTags = data.Targeting.Decision.Creative.AnchorTags;

    if (anchorTags) {
      for (var anchorKey in anchorTags) {
        if (Object.prototype.hasOwnProperty.call(anchorTags, anchorKey)) {
          var anchorTag = anchorTags[anchorKey];

          if (data.Creative.Options && data.Creative.Options.content) {
            data.Creative.Options.content = data.Creative.Options.content.replace(new RegExp(anchorKey, 'i'), anchorTag);
          }

          if (data.Creative.Options && data.Creative.Options.elements) {
            var elements = data.Creative.Options.elements.Elements;

            if (elements && elements.length) {
              for (var j = 0; j < elements.length; j++) {
                elements[j].content = elements[j].content.replace(new RegExp(anchorKey, 'i'), anchorTag);
              }
            }
          }
        }
      }
    }

    // Add pop under target
    if (interceptData.actionSet.ActionOptions.targetPopUnderDisplay && data.PopUnderTarget) {
      if (data.Targeting.Decision.PopUnderTarget.ID === 'Target') {
        interceptData.actionSet.ActionOptions.targetPopUnderDisplay.id = 'Target';
      } else {
        QSI.Orchestrator.addPopUnderTarget(interceptData, data.PopUnderTarget);
      }
    }

    var runCreative = function() {
      if (!data.Creative) {
        QSI.CreativeManager.runNoCreative(interceptData);
      } else {
        if(QSI.CreativeManager.isCreativeSupported(data.Creative.Type)) {
          QSI.CreativeManager['run' + data.Creative.Type](interceptData);
        } else {
          QSI.dbg.c("Creative type '" + data.Creative.Type + "' is not supported.");
        }
      }
    };

    // Custom trigger support
    if (actionSet.ActionOptions.useCustomTrigger) {
      var trigger;
      if (actionSet.ActionOptions.triggerType === 'scroll') {
        trigger = function() {
          try {
            var scrollPercentage = actionSet.ActionOptions.scrollPercentage ? actionSet.ActionOptions.scrollPercentage : 0;
            if (QSI.util.hasReachedScrollPosition(scrollPercentage)) {
              runCreative();
              QSI.util.stopObserving(window, actionSet.ActionOptions.triggerType, trigger);
            }
          } catch (e) { QSI.dbg.e(e); }
        };
        QSI.util.observe(window, actionSet.ActionOptions.triggerType, trigger);
      } else if (actionSet.ActionOptions.triggerEntirePage) {
        trigger = function() {
          try {
            runCreative();
            QSI.util.stopObserving(document.body, actionSet.ActionOptions.triggerType, trigger);
          } catch (e) { QSI.dbg.e(e); }
        };
        QSI.util.observe(document.body, actionSet.ActionOptions.triggerType, trigger);
      } else if (actionSet.ActionOptions.triggerType === 'pageLoad') {
        // This is the default behavior for the page load
        runCreative();
      } else {
        trigger = function() {
          try {
            runCreative();
            QSI.util.stopObserving(QSI.util.$(actionSet.ActionOptions.triggerElementID), actionSet.ActionOptions.triggerType, trigger);
          } catch (e) { QSI.dbg.e(e); }
        };
        QSI.util.observe(QSI.util.$(actionSet.ActionOptions.triggerElementID), actionSet.ActionOptions.triggerType, trigger);
      }
    } else {
      // Load the creative
      runCreative();
    }
  } catch (e) {
    QSI.dbg.e(e);
  }
};
  QSI.Orchestrator.init();

} catch (e) {
  QSI.dbg.e(e);
}