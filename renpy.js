var Module = typeof Module != "undefined" ? Module : {};
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0
}
Module.expectedDataFileDownloads++;
(function () {
    if (Module["ENVIRONMENT_IS_PTHREAD"]) return;
    var loadPackage = function (metadata) {
        var PACKAGE_PATH = "";
        if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window
                .location.pathname.toString().lastIndexOf("/")) + "/")
        } else if (typeof process === "undefined" && typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname
                .toString().lastIndexOf("/")) + "/")
        }
        var PACKAGE_NAME = "renpy.data";
        var REMOTE_PACKAGE_BASE = "renpy.data";
        if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") :
            REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];

        function fetchRemotePackage(packageName, packageSize, callback, errback) {
            if (typeof process === "object" && typeof process.versions === "object" && typeof process.versions
                .node === "string") {
                require("fs").readFile(packageName, function (err, contents) {
                    if (err) {
                        errback(err)
                    } else {
                        callback(contents.buffer)
                    }
                });
                return
            }
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function (event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size
                        }
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++
                    }
                    total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" +
                        total + ")")
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data...")
                }
            };
            xhr.onerror = function (event) {
                throw new Error("NetworkError for: " + packageName)
            };
            xhr.onload = function (event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr
                    .response) {
                    var packageData = xhr.response;
                    callback(packageData)
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL)
                }
            };
            xhr.send(null)
        }

        function handleError(error) {
            console.error("package error:", error)
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,
            REMOTE_PACKAGE_SIZE) : null;
        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function (data) {
            if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null
            } else {
                fetched = data
            }
        }, handleError);

        function runWithFS() {
            function assert(check, msg) {
                if (!check) throw msg + (new Error).stack
            }
            Module["FS_createPath"]("/", "lib", true, true);
            Module["FS_createPath"]("/lib", "python3.11", true, true);
            Module["FS_createPath"]("/lib/python3.11", "asyncio", true, true);
            Module["FS_createPath"]("/lib/python3.11", "certifi", true, true);
            Module["FS_createPath"]("/lib/python3.11", "chardet", true, true);
            Module["FS_createPath"](pL+"chardet", "cli", true, true);
            Module["FS_createPath"]("/lib/python3.11", "collections", true, true);
            Module["FS_createPath"]("/lib/python3.11", "concurrent", true, true);
            Module["FS_createPath"](pL+"concurrent", "futures", true, true);
            Module["FS_createPath"]("/lib/python3.11", "ctypes", true, true);
            Module["FS_createPath"](pL+"ctypes", "macholib", true, true);
            Module["FS_createPath"]("/lib/python3.11", "ecdsa", true, true);
            Module["FS_createPath"]("/lib/python3.11", "email", true, true);
            Module["FS_createPath"](pL+"email", "mime", true, true);
            Module["FS_createPath"]("/lib/python3.11", "encodings", true, true);
            Module["FS_createPath"]("/lib/python3.11", "future", true, true);
            Module["FS_createPath"](pL+"future", "backports", true, true);
            Module["FS_createPath"](pL+"future/backports", "email", true, true);
            Module["FS_createPath"](pL+"future/backports/email", "mime", true, true);
            Module["FS_createPath"](pL+"future/backports", "html", true, true);
            Module["FS_createPath"](pL+"future/backports", "http", true, true);
            Module["FS_createPath"](pL+"future/backports", "test", true, true);
            Module["FS_createPath"](pL+"future/backports", "urllib", true, true);
            Module["FS_createPath"](pL+"future/backports", "xmlrpc", true, true);
            Module["FS_createPath"](pL+"future", "builtins", true, true);
            Module["FS_createPath"](pL+"future", "moves", true, true);
            Module["FS_createPath"](pL+"future/moves", "dbm", true, true);
            Module["FS_createPath"](pL+"future/moves", "html", true, true);
            Module["FS_createPath"](pL+"future/moves", "http", true, true);
            Module["FS_createPath"](pL+"future/moves", "test", true, true);
            Module["FS_createPath"](pL+"future/moves", "tkinter", true, true);
            Module["FS_createPath"](pL+"future/moves", "urllib", true, true);
            Module["FS_createPath"](pL+"future/moves", "xmlrpc", true, true);
            Module["FS_createPath"](pL+"future", "standard_library", true, true);
            Module["FS_createPath"](pL+"future", "tests", true, true);
            Module["FS_createPath"](pL+"future", "types", true, true);
            Module["FS_createPath"](pL+"future", "utils", true, true);
            Module["FS_createPath"]("/lib/python3.11", "html", true, true);
            Module["FS_createPath"]("/lib/python3.11", "http", true, true);
            Module["FS_createPath"]("/lib/python3.11", "idna", true, true);
            Module["FS_createPath"]("/lib/python3.11", "importlib", true, true);
            Module["FS_createPath"](pL+"importlib", "metadata", true, true);
            Module["FS_createPath"](pL+"importlib", "resources", true, true);
            Module["FS_createPath"]("/lib/python3.11", "jnius", true, true);
            Module["FS_createPath"]("/lib/python3.11", "json", true, true);
            Module["FS_createPath"]("/lib/python3.11", "lib-dynload", true, true);
            Module["FS_createPath"]("/lib/python3.11", "logging", true, true);
            Module["FS_createPath"]("/lib/python3.11", "multiprocessing", true, true);
            Module["FS_createPath"](pL+"multiprocessing", "dummy", true, true);
            Module["FS_createPath"]("/lib/python3.11", "ordlookup", true, true);
            Module["FS_createPath"]("/lib/python3.11", "past", true, true);
            Module["FS_createPath"](pL+"past", "builtins", true, true);
            Module["FS_createPath"](pL+"past", "translation", true, true);
            Module["FS_createPath"](pL+"past", "types", true, true);
            Module["FS_createPath"](pL+"past", "utils", true, true);
            Module["FS_createPath"]("/lib/python3.11", "pyasn1", true, true);
            Module["FS_createPath"](pL+"pyasn1", "codec", true, true);
            Module["FS_createPath"](pL+"pyasn1/codec", "ber", true, true);
            Module["FS_createPath"](pL+"pyasn1/codec", "cer", true, true);
            Module["FS_createPath"](pL+"pyasn1/codec", "der", true, true);
            Module["FS_createPath"](pL+"pyasn1/codec", "native", true, true);
            Module["FS_createPath"](pL+"pyasn1", "compat", true, true);
            Module["FS_createPath"](pL+"pyasn1", "type", true, true);
            Module["FS_createPath"]("/lib/python3.11", "pygame_sdl2", true, true);
            Module["FS_createPath"](pL+"pygame_sdl2", "threads", true, true);
            Module["FS_createPath"]("/lib/python3.11", "pyobjus", true, true);
            Module["FS_createPath"]("/lib/python3.11", "re", true, true);
            Module["FS_createPath"]("/lib/python3.11", "requests", true, true);
            Module["FS_createPath"]("/lib/python3.11", "rsa", true, true);
            Module["FS_createPath"]("/lib/python3.11", "urllib", true, true);
            Module["FS_createPath"]("/lib/python3.11", "urllib3", true, true);
            Module["FS_createPath"](pL+"urllib3", "contrib", true, true);
            Module["FS_createPath"](pL+"urllib3/contrib", "_securetransport", true, true);
            Module["FS_createPath"](pL+"urllib3", "packages", true, true);
            Module["FS_createPath"](pL+"urllib3/packages", "backports", true, true);
            Module["FS_createPath"](pL+"urllib3/packages", "ssl_match_hostname", true, true);
            Module["FS_createPath"](pL+"urllib3", "util", true, true);
            Module["FS_createPath"]("/lib/python3.11", "xml", true, true);
            Module["FS_createPath"](pL+"xml", "dom", true, true);
            Module["FS_createPath"](pL+"xml", "etree", true, true);
            Module["FS_createPath"](pL+"xml", "parsers", true, true);
            Module["FS_createPath"](pL+"xml", "sax", true, true);
            Module["FS_createPath"]("/lib/python3.11", "zoneinfo", true, true);

            function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio
            }
            DataRequest.prototype = {
                requests: {},
                open: function (mode, name) {
                    this.name = name;
                    this.requests[name] = this;
                    Module["addRunDependency"]("fp " + this.name)
                },
                send: function () {},
                onload: function () {
                    var byteArray = this.byteArray.subarray(this.start, this.end);
                    this.finish(byteArray)
                },
                finish: function (byteArray) {
                    var that = this;
                    Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                    Module["removeRunDependency"]("fp " + that.name);
                    this.requests[this.name] = null
                }
            };
            var files = metadata["files"];
            for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]["start"], files[i]["end"], files[i]["audio"] || 0).open("GET", files[i]
                    ["filename"])
            }

            function processPackageData(arrayBuffer) {
                assert(arrayBuffer, "Loading data file failed.");
                assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                DataRequest.prototype.byteArray = byteArray;
                var files = metadata["files"];
                for (var i = 0; i < files.length; ++i) {
                    DataRequest.prototype.requests[files[i].filename].onload()
                }
                Module["removeRunDependency"]("datafile_renpy.data")
            }
            Module["addRunDependency"]("datafile_renpy.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
                fromCache: false
            };
            if (fetched) {
                processPackageData(fetched);
                fetched = null
            } else {
                fetchedCallback = processPackageData
            }
        }
        if (Module["calledRun"]) {
            runWithFS()
        } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
        }
    };
    const pL = "/lib/python3.11/";
    const files = [{
        "filename": pL+"__future__.pyc",
        "start": 0,
        "end": 4952
    }, {
        "filename": pL+"_bootsubprocess.pyc",
        "start": 4952,
        "end": 9458
    }, {
        "filename": pL+"_collections_abc.pyc",
        "start": 9458,
        "end": 60886
    }, {
        "filename": pL+"_compat_pickle.pyc",
        "start": 60886,
        "end": 68440
    }, {
        "filename": pL+"_compression.pyc",
        "start": 68440,
        "end": 76551
    }, {
        "filename": pL+"_markupbase.pyc",
        "start": 76551,
        "end": 90872
    }, {
        "filename": pL+"_osx_support.pyc",
        "start": 90872,
        "end": 110904
    }, {
        "filename": pL+"_py_abc.pyc",
        "start": 110904,
        "end": 118838
    }, {
        "filename": pL+"_pydecimal.pyc",
        "start": 118838,
        "end": 364549
    }, {
        "filename": pL+"_pyio.pyc",
        "start": 364549,
        "end": 485205
    }, {
        "filename": pL+"_sitebuiltins.pyc",
        "start": 485205,
        "end": 490681
    }, {
        "filename": pL+"_strptime.pyc",
        "start": 490681,
        "end": 518838
    }, {
        "filename": pL+"_threading_local.pyc",
        "start": 518838,
        "end": 528096
    }, {
        "filename": pL+"_weakrefset.pyc",
        "start": 528096,
        "end": 541308
    }, {
        "filename": pL+"abc.pyc",
        "start": 541308,
        "end": 550374
    }, {
        "filename": pL+"argparse.pyc",
        "start": 550374,
        "end": 664057
    }, {
        "filename": pL+"ast.pyc",
        "start": 664057,
        "end": 773044
    }, {
        "filename": pL+"asyncio/__init__.pyc",
        "start": 773044,
        "end": 774429
    }, {
        "filename": pL+"asyncio/__main__.pyc",
        "start": 774429,
        "end": 780410
    }, {
        "filename": pL+"asyncio/base_events.pyc",
        "start": 780410,
        "end": 871197
    }, {
        "filename": pL+"asyncio/base_futures.pyc",
        "start": 871197,
        "end": 874637
    }, {
        "filename": pL+"asyncio/base_subprocess.pyc",
        "start": 874637,
        "end": 891252
    }, {
        "filename": pL+"asyncio/base_tasks.pyc",
        "start": 891252,
        "end": 895508
    }, {
        "filename": pL+"asyncio/constants.pyc",
        "start": 895508,
        "end": 896508
    }, {
        "filename": pL+"asyncio/coroutines.pyc",
        "start": 896508,
        "end": 900551
    }, {
        "filename": pL+"asyncio/events.pyc",
        "start": 900551,
        "end": 938616
    }, {
        "filename": pL+"asyncio/exceptions.pyc",
        "start": 938616,
        "end": 942298
    }, {
        "filename": pL+"asyncio/format_helpers.pyc",
        "start": 942298,
        "end": 946474
    }, {
        "filename": pL+"asyncio/futures.pyc",
        "start": 946474,
        "end": 965033
    }, {
        "filename": pL+"asyncio/locks.pyc",
        "start": 965033,
        "end": 994332
    }, {
        "filename": pL+"asyncio/log.pyc",
        "start": 994332,
        "end": 994665
    }, {
        "filename": pL+"asyncio/mixins.pyc",
        "start": 994665,
        "end": 995907
    }, {
        "filename": pL+"asyncio/proactor_events.pyc",
        "start": 995907,
        "end": 1043731
    }, {
        "filename": pL+"asyncio/protocols.pyc",
        "start": 1043731,
        "end": 1053217
    }, {
        "filename": pL+"asyncio/queues.pyc",
        "start": 1053217,
        "end": 1066095
    }, {
        "filename": pL+"asyncio/runners.pyc",
        "start": 1066095,
        "end": 1076429
    }, {
        "filename": pL+"asyncio/selector_events.pyc",
        "start": 1076429,
        "end": 1140544
    }, {
        "filename": pL+"asyncio/sslproto.pyc",
        "start": 1140544,
        "end": 1184617
    }, {
        "filename": pL+"asyncio/staggered.pyc",
        "start": 1184617,
        "end": 1191302
    }, {
        "filename": pL+"asyncio/streams.pyc",
        "start": 1191302,
        "end": 1225154
    }, {
        "filename": pL+"asyncio/subprocess.pyc",
        "start": 1225154,
        "end": 1237867
    }, {
        "filename": pL+"asyncio/taskgroups.pyc",
        "start": 1237867,
        "end": 1245319
    }, {
        "filename": pL+"asyncio/tasks.pyc",
        "start": 1245319,
        "end": 1286523
    }, {
        "filename": pL+"asyncio/threads.pyc",
        "start": 1286523,
        "end": 1287855
    }, {
        "filename": pL+"asyncio/timeouts.pyc",
        "start": 1287855,
        "end": 1295102
    }, {
        "filename": pL+"asyncio/transports.pyc",
        "start": 1295102,
        "end": 1310354
    }, {
        "filename": pL+"asyncio/trsock.pyc",
        "start": 1310354,
        "end": 1315782
    }, {
        "filename": pL+"asyncio/unix_events.pyc",
        "start": 1315782,
        "end": 1389807
    }, {
        "filename": pL+"asyncio/windows_events.pyc",
        "start": 1389807,
        "end": 1436128
    }, {
        "filename": pL+"asyncio/windows_utils.pyc",
        "start": 1436128,
        "end": 1443984
    }, {
        "filename": pL+"base64.pyc",
        "start": 1443984,
        "end": 1472585
    }, {
        "filename": pL+"bisect.pyc",
        "start": 1472585,
        "end": 1476384
    }, {
        "filename": pL+"bz2.pyc",
        "start": 1476384,
        "end": 1492649
    }, {
        "filename": pL+"cProfile.pyc",
        "start": 1492649,
        "end": 1501736
    }, {
        "filename": pL+"calendar.pyc",
        "start": 1501736,
        "end": 1546631
    }, {
        "filename": pL+"certifi/__init__.pyc",
        "start": 1546631,
        "end": 1546976
    }, {
        "filename": pL+"certifi/__main__.pyc",
        "start": 1546976,
        "end": 1547710
    }, {
        "filename": pL+"certifi/cacert.pem",
        "start": 1547710,
        "end": 1822943
    }, {
        "filename": pL+"certifi/cacert.pem.pyc",
        "start": 1822943,
        "end": 2098176
    }, {
        "filename": pL+"certifi/core.pyc",
        "start": 2098176,
        "end": 2101539
    }, {
        "filename": pL+"cgi.pyc",
        "start": 2101539,
        "end": 2145712
    }, {
        "filename": pL+"chardet/__init__.pyc",
        "start": 2145712,
        "end": 2147018
    }, {
        "filename": pL+"chardet/big5freq.pyc",
        "start": 2147018,
        "end": 2174225
    }, {
        "filename": pL+"chardet/big5prober.pyc",
        "start": 2174225,
        "end": 2175867
    }, {
        "filename": pL+"chardet/chardistribution.pyc",
        "start": 2175867,
        "end": 2185496
    }, {
        "filename": pL+"chardet/charsetgroupprober.pyc",
        "start": 2185496,
        "end": 2189447
    }, {
        "filename": pL+"chardet/charsetprober.pyc",
        "start": 2189447,
        "end": 2194271
    }, {
        "filename": pL+"chardet/cli/__init__.pyc",
        "start": 2194271,
        "end": 2194478
    }, {
        "filename": pL+"chardet/cli/chardetect.pyc",
        "start": 2194478,
        "end": 2198439
    }, {
        "filename": pL+"chardet/codingstatemachine.pyc",
        "start": 2198439,
        "end": 2202149
    }, {
        "filename": pL+"chardet/compat.pyc",
        "start": 2202149,
        "end": 2202586
    }, {
        "filename": pL+"chardet/cp949prober.pyc",
        "start": 2202586,
        "end": 2204237
    }, {
        "filename": pL+"chardet/enums.pyc",
        "start": 2204237,
        "end": 2207525
    }, {
        "filename": pL+"chardet/escprober.pyc",
        "start": 2207525,
        "end": 2212136
    }, {
        "filename": pL+"chardet/escsm.pyc",
        "start": 2212136,
        "end": 2224472
    }, {
        "filename": pL+"chardet/eucjpprober.pyc",
        "start": 2224472,
        "end": 2228985
    }, {
        "filename": pL+"chardet/euckrfreq.pyc",
        "start": 2228985,
        "end": 2241075
    }, {
        "filename": pL+"chardet/euckrprober.pyc",
        "start": 2241075,
        "end": 2242718
    }, {
        "filename": pL+"chardet/euctwfreq.pyc",
        "start": 2242718,
        "end": 2269930
    }, {
        "filename": pL+"chardet/euctwprober.pyc",
        "start": 2269930,
        "end": 2271573
    }, {
        "filename": pL+"chardet/gb2312freq.pyc",
        "start": 2271573,
        "end": 2290707
    }, {
        "filename": pL+"chardet/gb2312prober.pyc",
        "start": 2290707,
        "end": 2292365
    }, {
        "filename": pL+"chardet/hebrewprober.pyc",
        "start": 2292365,
        "end": 2297360
    }, {
        "filename": pL+"chardet/jisfreq.pyc",
        "start": 2297360,
        "end": 2319523
    }, {
        "filename": pL+"chardet/jpcntx.pyc",
        "start": 2319523,
        "end": 2359228
    }, {
        "filename": pL+"chardet/langbulgarianmodel.pyc",
        "start": 2359228,
        "end": 2382926
    }, {
        "filename": pL+"chardet/langcyrillicmodel.pyc",
        "start": 2382926,
        "end": 2412182
    }, {
        "filename": pL+"chardet/langgreekmodel.pyc",
        "start": 2412182,
        "end": 2435837
    }, {
        "filename": pL+"chardet/langhebrewmodel.pyc",
        "start": 2435837,
        "end": 2458095
    }, {
        "filename": pL+"chardet/langhungarianmodel.pyc",
        "start": 2458095,
        "end": 2481782
    }, {
        "filename": pL+"chardet/langthaimodel.pyc",
        "start": 2481782,
        "end": 2504015
    }, {
        "filename": pL+"chardet/langturkishmodel.pyc",
        "start": 2504015,
        "end": 2526275
    }, {
        "filename": pL+"chardet/latin1prober.pyc",
        "start": 2526275,
        "end": 2533330
    }, {
        "filename": pL+"chardet/mbcharsetprober.pyc",
        "start": 2533330,
        "end": 2537337
    }, {
        "filename": pL+"chardet/mbcsgroupprober.pyc",
        "start": 2537337,
        "end": 2539129
    }, {
        "filename": pL+"chardet/mbcssm.pyc",
        "start": 2539129,
        "end": 2567448
    }, {
        "filename": pL+"chardet/sbcharsetprober.pyc",
        "start": 2567448,
        "end": 2572715
    }, {
        "filename": pL+"chardet/sbcsgroupprober.pyc",
        "start": 2572715,
        "end": 2575620
    }, {
        "filename": pL+"chardet/sjisprober.pyc",
        "start": 2575620,
        "end": 2580241
    }, {
        "filename": pL+"chardet/universaldetector.pyc",
        "start": 2580241,
        "end": 2590411
    }, {
        "filename": pL+"chardet/utf8prober.pyc",
        "start": 2590411,
        "end": 2593710
    }, {
        "filename": pL+"chardet/version.pyc",
        "start": 2593710,
        "end": 2594218
    }, {
        "filename": pL+"chunk.pyc",
        "start": 2594218,
        "end": 2601717
    }, {
        "filename": pL+"cmd.pyc",
        "start": 2601717,
        "end": 2622408
    }, {
        "filename": pL+"code.pyc",
        "start": 2622408,
        "end": 2636379
    }, {
        "filename": pL+"codecs.pyc",
        "start": 2636379,
        "end": 2680846
    }, {
        "filename": pL+"codeop.pyc",
        "start": 2680846,
        "end": 2688108
    }, {
        "filename": pL+"collections/__init__.pyc",
        "start": 2688108,
        "end": 2766311
    }, {
        "filename": pL+"collections/abc.pyc",
        "start": 2766311,
        "end": 2766646
    }, {
        "filename": pL+"colorsys.pyc",
        "start": 2766646,
        "end": 2771704
    }, {
        "filename": pL+"compileall.pyc",
        "start": 2771704,
        "end": 2793498
    }, {
        "filename": pL+"concurrent/__init__.pyc",
        "start": 2793498,
        "end": 2793690
    }, {
        "filename": pL+"concurrent/futures/__init__.pyc",
        "start": 2793690,
        "end": 2795192
    }, {
        "filename": pL+"concurrent/futures/_base.pyc",
        "start": 2795192,
        "end": 2832590
    }, {
        "filename": pL+"concurrent/futures/process.pyc",
        "start": 2832590,
        "end": 2870702
    }, {
        "filename": pL+"concurrent/futures/thread.pyc",
        "start": 2870702,
        "end": 2881845
    }, {
        "filename": pL+"configparser.pyc",
        "start": 2881845,
        "end": 2953792
    }, {
        "filename": pL+"contextlib.pyc",
        "start": 2953792,
        "end": 2986412
    }, {
        "filename": pL+"contextvars.pyc",
        "start": 2986412,
        "end": 2986750
    }, {
        "filename": pL+"copy.pyc",
        "start": 2986750,
        "end": 2998023
    }, {
        "filename": pL+"copyreg.pyc",
        "start": 2998023,
        "end": 3006305
    }, {
        "filename": pL+"csv.pyc",
        "start": 3006305,
        "end": 3026484
    }, {
        "filename": pL+"ctypes/__init__.pyc",
        "start": 3026484,
        "end": 3053420
    }, {
        "filename": pL+"ctypes/_aix.pyc",
        "start": 3053420,
        "end": 3066707
    }, {
        "filename": pL+"ctypes/_endian.pyc",
        "start": 3066707,
        "end": 3070734
    }, {
        "filename": pL+"ctypes/macholib/__init__.pyc",
        "start": 3070734,
        "end": 3071102
    }, {
        "filename": pL+"ctypes/macholib/dyld.pyc",
        "start": 3071102,
        "end": 3078847
    }, {
        "filename": pL+"ctypes/macholib/dylib.pyc",
        "start": 3078847,
        "end": 3080232
    }, {
        "filename": pL+"ctypes/macholib/framework.pyc",
        "start": 3080232,
        "end": 3081747
    }, {
        "filename": pL+"ctypes/util.pyc",
        "start": 3081747,
        "end": 3100401
    }, {
        "filename": pL+"ctypes/wintypes.pyc",
        "start": 3100401,
        "end": 3108877
    }, {
        "filename": pL+"dataclasses.pyc",
        "start": 3108877,
        "end": 3155921
    }, {
        "filename": pL+"datetime.pyc",
        "start": 3155921,
        "end": 3258305
    }, {
        "filename": pL+"decimal.pyc",
        "start": 3258305,
        "end": 3258887
    }, {
        "filename": pL+"difflib.pyc",
        "start": 3258887,
        "end": 3340952
    }, {
        "filename": pL+"dis.pyc",
        "start": 3340952,
        "end": 3377838
    }, {
        "filename": pL+"doctest.pyc",
        "start": 3377838,
        "end": 3489879
    }, {
        "filename": pL+"ecdsa/__init__.pyc",
        "start": 3489879,
        "end": 3491995
    }, {
        "filename": pL+"ecdsa/_compat.pyc",
        "start": 3491995,
        "end": 3499360
    }, {
        "filename": pL+"ecdsa/_rwlock.pyc",
        "start": 3499360,
        "end": 3504445
    }, {
        "filename": pL+"ecdsa/_sha3.pyc",
        "start": 3504445,
        "end": 3510516
    }, {
        "filename": pL+"ecdsa/_version.pyc",
        "start": 3510516,
        "end": 3511123
    }, {
        "filename": pL+"ecdsa/curves.pyc",
        "start": 3511123,
        "end": 3528625
    }, {
        "filename": pL+"ecdsa/der.pyc",
        "start": 3528625,
        "end": 3548784
    }, {
        "filename": pL+"ecdsa/ecdh.pyc",
        "start": 3548784,
        "end": 3562798
    }, {
        "filename": pL+"ecdsa/ecdsa.pyc",
        "start": 3562798,
        "end": 3592012
    }, {
        "filename": pL+"ecdsa/eddsa.pyc",
        "start": 3592012,
        "end": 3603554
    }, {
        "filename": pL+"ecdsa/ellipticcurve.pyc",
        "start": 3603554,
        "end": 3670350
    }, {
        "filename": pL+"ecdsa/errors.pyc",
        "start": 3670350,
        "end": 3670885
    }, {
        "filename": pL+"ecdsa/keys.pyc",
        "start": 3670885,
        "end": 3740592
    }, {
        "filename": pL+"ecdsa/numbertheory.pyc",
        "start": 3740592,
        "end": 3759790
    }, {
        "filename": pL+"ecdsa/rfc6979.pyc",
        "start": 3759790,
        "end": 3764070
    }, {
        "filename": pL+"ecdsa/test_curves.pyc",
        "start": 3764070,
        "end": 3789272
    }, {
        "filename": pL+"ecdsa/test_der.pyc",
        "start": 3789272,
        "end": 3828291
    }, {
        "filename": pL+"ecdsa/test_ecdh.pyc",
        "start": 3828291,
        "end": 3852597
    }, {
        "filename": pL+"ecdsa/test_ecdsa.pyc",
        "start": 3852597,
        "end": 3882822
    }, {
        "filename": pL+"ecdsa/test_eddsa.pyc",
        "start": 3882822,
        "end": 3929616
    }, {
        "filename": pL+"ecdsa/test_ellipticcurve.pyc",
        "start": 3929616,
        "end": 3941586
    }, {
        "filename": pL+"ecdsa/test_jacobi.pyc",
        "start": 3941586,
        "end": 3978354
    }, {
        "filename": pL+"ecdsa/test_keys.pyc",
        "start": 3978354,
        "end": 4031024
    }, {
        "filename": pL+"ecdsa/test_malformed_sigs.pyc",
        "start": 4031024,
        "end": 4049096
    }, {
        "filename": pL+"ecdsa/test_numbertheory.pyc",
        "start": 4049096,
        "end": 4071958
    }, {
        "filename": pL+"ecdsa/test_pyecdsa.pyc",
        "start": 4071958,
        "end": 4203847
    }, {
        "filename": pL+"ecdsa/test_rw_lock.pyc",
        "start": 4203847,
        "end": 4215670
    }, {
        "filename": pL+"ecdsa/test_sha3.pyc",
        "start": 4215670,
        "end": 4221001
    }, {
        "filename": pL+"ecdsa/util.pyc",
        "start": 4221001,
        "end": 4239723
    }, {
        "filename": pL+"email/__init__.pyc",
        "start": 4239723,
        "end": 4241872
    }, {
        "filename": pL+"email/_encoded_words.pyc",
        "start": 4241872,
        "end": 4251037
    }, {
        "filename": pL+"email/_header_value_parser.pyc",
        "start": 4251037,
        "end": 4401272
    }, {
        "filename": pL+"email/_parseaddr.pyc",
        "start": 4401272,
        "end": 4425812
    }, {
        "filename": pL+"email/_policybase.pyc",
        "start": 4425812,
        "end": 4445096
    }, {
        "filename": pL+"email/base64mime.pyc",
        "start": 4445096,
        "end": 4449489
    }, {
        "filename": pL+"email/charset.pyc",
        "start": 4449489,
        "end": 4465575
    }, {
        "filename": pL+"email/contentmanager.pyc",
        "start": 4465575,
        "end": 4479537
    }, {
        "filename": pL+"email/encoders.pyc",
        "start": 4479537,
        "end": 4481965
    }, {
        "filename": pL+"email/errors.pyc",
        "start": 4481965,
        "end": 4490451
    }, {
        "filename": pL+"email/feedparser.pyc",
        "start": 4490451,
        "end": 4512036
    }, {
        "filename": pL+"email/generator.pyc",
        "start": 4512036,
        "end": 4533724
    }, {
        "filename": pL+"email/header.pyc",
        "start": 4533724,
        "end": 4560852
    }, {
        "filename": pL+"email/headerregistry.pyc",
        "start": 4560852,
        "end": 4594680
    }, {
        "filename": pL+"email/iterators.pyc",
        "start": 4594680,
        "end": 4597892
    }, {
        "filename": pL+"email/message.pyc",
        "start": 4597892,
        "end": 4657055
    }, {
        "filename": pL+"email/mime/__init__.pyc",
        "start": 4657055,
        "end": 4657247
    }, {
        "filename": pL+"email/mime/application.pyc",
        "start": 4657247,
        "end": 4659114
    }, {
        "filename": pL+"email/mime/audio.pyc",
        "start": 4659114,
        "end": 4663046
    }, {
        "filename": pL+"email/mime/base.pyc",
        "start": 4663046,
        "end": 4664486
    }, {
        "filename": pL+"email/mime/image.pyc",
        "start": 4664486,
        "end": 4671149
    }, {
        "filename": pL+"email/mime/message.pyc",
        "start": 4671149,
        "end": 4672929
    }, {
        "filename": pL+"email/mime/multipart.pyc",
        "start": 4672929,
        "end": 4674841
    }, {
        "filename": pL+"email/mime/nonmultipart.pyc",
        "start": 4674841,
        "end": 4675868
    }, {
        "filename": pL+"email/mime/text.pyc",
        "start": 4675868,
        "end": 4677671
    }, {
        "filename": pL+"email/parser.pyc",
        "start": 4677671,
        "end": 4685094
    }, {
        "filename": pL+"email/policy.pyc",
        "start": 4685094,
        "end": 4697573
    }, {
        "filename": pL+"email/quoprimime.pyc",
        "start": 4697573,
        "end": 4708898
    }, {
        "filename": pL+"email/utils.pyc",
        "start": 4708898,
        "end": 4724435
    }, {
        "filename": pL+"encodings/__init__.pyc",
        "start": 4724435,
        "end": 4731041
    }, {
        "filename": pL+"encodings/aliases.pyc",
        "start": 4731041,
        "end": 4743729
    }, {
        "filename": pL+"encodings/ascii.pyc",
        "start": 4743729,
        "end": 4746478
    }, {
        "filename": pL+"encodings/base64_codec.pyc",
        "start": 4746478,
        "end": 4749840
    }, {
        "filename": pL+"encodings/big5.pyc",
        "start": 4749840,
        "end": 4752014
    }, {
        "filename": pL+"encodings/big5hkscs.pyc",
        "start": 4752014,
        "end": 4754198
    }, {
        "filename": pL+"encodings/bz2_codec.pyc",
        "start": 4754198,
        "end": 4759084
    }, {
        "filename": pL+"encodings/charmap.pyc",
        "start": 4759084,
        "end": 4763244
    }, {
        "filename": pL+"encodings/cp037.pyc",
        "start": 4763244,
        "end": 4766669
    }, {
        "filename": pL+"encodings/cp1006.pyc",
        "start": 4766669,
        "end": 4770170
    }, {
        "filename": pL+"encodings/cp1026.pyc",
        "start": 4770170,
        "end": 4773599
    }, {
        "filename": pL+"encodings/cp1125.pyc",
        "start": 4773599,
        "end": 4787892
    }, {
        "filename": pL+"encodings/cp1140.pyc",
        "start": 4787892,
        "end": 4791307
    }, {
        "filename": pL+"encodings/cp1250.pyc",
        "start": 4791307,
        "end": 4794759
    }, {
        "filename": pL+"encodings/cp1251.pyc",
        "start": 4794759,
        "end": 4798208
    }, {
        "filename": pL+"encodings/cp1252.pyc",
        "start": 4798208,
        "end": 4801660
    }, {
        "filename": pL+"encodings/cp1253.pyc",
        "start": 4801660,
        "end": 4805125
    }, {
        "filename": pL+"encodings/cp1254.pyc",
        "start": 4805125,
        "end": 4808579
    }, {
        "filename": pL+"encodings/cp1255.pyc",
        "start": 4808579,
        "end": 4812052
    }, {
        "filename": pL+"encodings/cp1256.pyc",
        "start": 4812052,
        "end": 4815503
    }, {
        "filename": pL+"encodings/cp1257.pyc",
        "start": 4815503,
        "end": 4818962
    }, {
        "filename": pL+"encodings/cp1258.pyc",
        "start": 4818962,
        "end": 4822419
    }, {
        "filename": pL+"encodings/cp273.pyc",
        "start": 4822419,
        "end": 4825830
    }, {
        "filename": pL+"encodings/cp424.pyc",
        "start": 4825830,
        "end": 4829285
    }, {
        "filename": pL+"encodings/cp437.pyc",
        "start": 4829285,
        "end": 4843211
    }, {
        "filename": pL+"encodings/cp500.pyc",
        "start": 4843211,
        "end": 4846636
    }, {
        "filename": pL+"encodings/cp720.pyc",
        "start": 4846636,
        "end": 4850158
    }, {
        "filename": pL+"encodings/cp737.pyc",
        "start": 4850158,
        "end": 4864486
    }, {
        "filename": pL+"encodings/cp775.pyc",
        "start": 4864486,
        "end": 4878452
    }, {
        "filename": pL+"encodings/cp850.pyc",
        "start": 4878452,
        "end": 4891959
    }, {
        "filename": pL+"encodings/cp852.pyc",
        "start": 4891959,
        "end": 4905941
    }, {
        "filename": pL+"encodings/cp855.pyc",
        "start": 4905941,
        "end": 4920236
    }, {
        "filename": pL+"encodings/cp856.pyc",
        "start": 4920236,
        "end": 4923723
    }, {
        "filename": pL+"encodings/cp857.pyc",
        "start": 4923723,
        "end": 4937025
    }, {
        "filename": pL+"encodings/cp858.pyc",
        "start": 4937025,
        "end": 4950502
    }, {
        "filename": pL+"encodings/cp860.pyc",
        "start": 4950502,
        "end": 4964399
    }, {
        "filename": pL+"encodings/cp861.pyc",
        "start": 4964399,
        "end": 4978321
    }, {
        "filename": pL+"encodings/cp862.pyc",
        "start": 4978321,
        "end": 4992476
    }, {
        "filename": pL+"encodings/cp863.pyc",
        "start": 4992476,
        "end": 5006394
    }, {
        "filename": pL+"encodings/cp864.pyc",
        "start": 5006394,
        "end": 5020351
    }, {
        "filename": pL+"encodings/cp865.pyc",
        "start": 5020351,
        "end": 5034273
    }, {
        "filename": pL+"encodings/cp866.pyc",
        "start": 5034273,
        "end": 5048608
    }, {
        "filename": pL+"encodings/cp869.pyc",
        "start": 5048608,
        "end": 5062467
    }, {
        "filename": pL+"encodings/cp874.pyc",
        "start": 5062467,
        "end": 5066020
    }, {
        "filename": pL+"encodings/cp875.pyc",
        "start": 5066020,
        "end": 5069442
    }, {
        "filename": pL+"encodings/cp932.pyc",
        "start": 5069442,
        "end": 5071618
    }, {
        "filename": pL+"encodings/cp949.pyc",
        "start": 5071618,
        "end": 5073794
    }, {
        "filename": pL+"encodings/cp950.pyc",
        "start": 5073794,
        "end": 5075970
    }, {
        "filename": pL+"encodings/euc_jis_2004.pyc",
        "start": 5075970,
        "end": 5078160
    }, {
        "filename": pL+"encodings/euc_jisx0213.pyc",
        "start": 5078160,
        "end": 5080350
    }, {
        "filename": pL+"encodings/euc_jp.pyc",
        "start": 5080350,
        "end": 5082528
    }, {
        "filename": pL+"encodings/euc_kr.pyc",
        "start": 5082528,
        "end": 5084706
    }, {
        "filename": pL+"encodings/gb18030.pyc",
        "start": 5084706,
        "end": 5086886
    }, {
        "filename": pL+"encodings/gb2312.pyc",
        "start": 5086886,
        "end": 5089064
    }, {
        "filename": pL+"encodings/gbk.pyc",
        "start": 5089064,
        "end": 5091236
    }, {
        "filename": pL+"encodings/hex_codec.pyc",
        "start": 5091236,
        "end": 5094585
    }, {
        "filename": pL+"encodings/hp_roman8.pyc",
        "start": 5094585,
        "end": 5098211
    }, {
        "filename": pL+"encodings/hz.pyc",
        "start": 5098211,
        "end": 5100381
    }, {
        "filename": pL+"encodings/idna.pyc",
        "start": 5100381,
        "end": 5112061
    }, {
        "filename": pL+"encodings/iso2022_jp.pyc",
        "start": 5112061,
        "end": 5114252
    }, {
        "filename": pL+"encodings/iso2022_jp_1.pyc",
        "start": 5114252,
        "end": 5116447
    }, {
        "filename": pL+"encodings/iso2022_jp_2.pyc",
        "start": 5116447,
        "end": 5118642
    }, {
        "filename": pL+"encodings/iso2022_jp_2004.pyc",
        "start": 5118642,
        "end": 5120844
    }, {
        "filename": pL+"encodings/iso2022_jp_3.pyc",
        "start": 5120844,
        "end": 5123039
    }, {
        "filename": pL+"encodings/iso2022_jp_ext.pyc",
        "start": 5123039,
        "end": 5125239
    }, {
        "filename": pL+"encodings/iso2022_kr.pyc",
        "start": 5125239,
        "end": 5127430
    }, {
        "filename": pL+"encodings/iso8859_1.pyc",
        "start": 5127430,
        "end": 5130854
    }, {
        "filename": pL+"encodings/iso8859_10.pyc",
        "start": 5130854,
        "end": 5134283
    }, {
        "filename": pL+"encodings/iso8859_11.pyc",
        "start": 5134283,
        "end": 5137806
    }, {
        "filename": pL+"encodings/iso8859_13.pyc",
        "start": 5137806,
        "end": 5141238
    }, {
        "filename": pL+"encodings/iso8859_14.pyc",
        "start": 5141238,
        "end": 5144688
    }, {
        "filename": pL+"encodings/iso8859_15.pyc",
        "start": 5144688,
        "end": 5148117
    }, {
        "filename": pL+"encodings/iso8859_16.pyc",
        "start": 5148117,
        "end": 5151548
    }, {
        "filename": pL+"encodings/iso8859_2.pyc",
        "start": 5151548,
        "end": 5154972
    }, {
        "filename": pL+"encodings/iso8859_3.pyc",
        "start": 5154972,
        "end": 5158403
    }, {
        "filename": pL+"encodings/iso8859_4.pyc",
        "start": 5158403,
        "end": 5161827
    }, {
        "filename": pL+"encodings/iso8859_5.pyc",
        "start": 5161827,
        "end": 5165252
    }, {
        "filename": pL+"encodings/iso8859_6.pyc",
        "start": 5165252,
        "end": 5168721
    }, {
        "filename": pL+"encodings/iso8859_7.pyc",
        "start": 5168721,
        "end": 5172153
    }, {
        "filename": pL+"encodings/iso8859_8.pyc",
        "start": 5172153,
        "end": 5175616
    }, {
        "filename": pL+"encodings/iso8859_9.pyc",
        "start": 5175616,
        "end": 5179040
    }, {
        "filename": pL+"encodings/johab.pyc",
        "start": 5179040,
        "end": 5181216
    }, {
        "filename": pL+"encodings/koi8_r.pyc",
        "start": 5181216,
        "end": 5184692
    }, {
        "filename": pL+"encodings/koi8_t.pyc",
        "start": 5184692,
        "end": 5188079
    }, {
        "filename": pL+"encodings/koi8_u.pyc",
        "start": 5188079,
        "end": 5191541
    }, {
        "filename": pL+"encodings/kz1048.pyc",
        "start": 5191541,
        "end": 5194980
    }, {
        "filename": pL+"encodings/latin_1.pyc",
        "start": 5194980,
        "end": 5197741
    }, {
        "filename": pL+"encodings/mac_arabic.pyc",
        "start": 5197741,
        "end": 5211553
    }, {
        "filename": pL+"encodings/mac_croatian.pyc",
        "start": 5211553,
        "end": 5215024
    }, {
        "filename": pL+"encodings/mac_cyrillic.pyc",
        "start": 5215024,
        "end": 5218485
    }, {
        "filename": pL+"encodings/mac_farsi.pyc",
        "start": 5218485,
        "end": 5221890
    }, {
        "filename": pL+"encodings/mac_greek.pyc",
        "start": 5221890,
        "end": 5225335
    }, {
        "filename": pL+"encodings/mac_iceland.pyc",
        "start": 5225335,
        "end": 5228799
    }, {
        "filename": pL+"encodings/mac_latin2.pyc",
        "start": 5228799,
        "end": 5232404
    }, {
        "filename": pL+"encodings/mac_roman.pyc",
        "start": 5232404,
        "end": 5235866
    }, {
        "filename": pL+"encodings/mac_romanian.pyc",
        "start": 5235866,
        "end": 5239338
    }, {
        "filename": pL+"encodings/mac_turkish.pyc",
        "start": 5239338,
        "end": 5242803
    }, {
        "filename": pL+"encodings/mbcs.pyc",
        "start": 5242803,
        "end": 5245200
    }, {
        "filename": pL+"encodings/oem.pyc",
        "start": 5245200,
        "end": 5247410
    }, {
        "filename": pL+"encodings/palmos.pyc",
        "start": 5247410,
        "end": 5250862
    }, {
        "filename": pL+"encodings/ptcp154.pyc",
        "start": 5250862,
        "end": 5254408
    }, {
        "filename": pL+"encodings/punycode.pyc",
        "start": 5254408,
        "end": 5265304
    }, {
        "filename": pL+"encodings/quopri_codec.pyc",
        "start": 5265304,
        "end": 5268957
    }, {
        "filename": pL+"encodings/raw_unicode_escape.pyc",
        "start": 5268957,
        "end": 5271848
    }, {
        "filename": pL+"encodings/rot_13.pyc",
        "start": 5271848,
        "end": 5276725
    }, {
        "filename": pL+"encodings/shift_jis.pyc",
        "start": 5276725,
        "end": 5278909
    }, {
        "filename": pL+"encodings/shift_jis_2004.pyc",
        "start": 5278909,
        "end": 5281104
    }, {
        "filename": pL+"encodings/shift_jisx0213.pyc",
        "start": 5281104,
        "end": 5283299
    }, {
        "filename": pL+"encodings/tis_620.pyc",
        "start": 5283299,
        "end": 5286813
    }, {
        "filename": pL+"encodings/undefined.pyc",
        "start": 5286813,
        "end": 5289677
    }, {
        "filename": pL+"encodings/unicode_escape.pyc",
        "start": 5289677,
        "end": 5292548
    }, {
        "filename": pL+"encodings/utf_16.pyc",
        "start": 5292548,
        "end": 5300675
    }, {
        "filename": pL+"encodings/utf_16_be.pyc",
        "start": 5300675,
        "end": 5303052
    }, {
        "filename": pL+"encodings/utf_16_le.pyc",
        "start": 5303052,
        "end": 5305429
    }, {
        "filename": pL+"encodings/utf_32.pyc",
        "start": 5305429,
        "end": 5313451
    }, {
        "filename": pL+"encodings/utf_32_be.pyc",
        "start": 5313451,
        "end": 5315721
    }, {
        "filename": pL+"encodings/utf_32_le.pyc",
        "start": 5315721,
        "end": 5317991
    }, {
        "filename": pL+"encodings/utf_7.pyc",
        "start": 5317991,
        "end": 5320289
    }, {
        "filename": pL+"encodings/utf_8.pyc",
        "start": 5320289,
        "end": 5322646
    }, {
        "filename": pL+"encodings/utf_8_sig.pyc",
        "start": 5322646,
        "end": 5330009
    }, {
        "filename": pL+"encodings/uu_codec.pyc",
        "start": 5330009,
        "end": 5335322
    }, {
        "filename": pL+"encodings/zlib_codec.pyc",
        "start": 5335322,
        "end": 5340105
    }, {
        "filename": pL+"enum.pyc",
        "start": 5340105,
        "end": 5425974
    }, {
        "filename": pL+"filecmp.pyc",
        "start": 5425974,
        "end": 5441761
    }, {
        "filename": pL+"fileinput.pyc",
        "start": 5441761,
        "end": 5462999
    }, {
        "filename": pL+"fnmatch.pyc",
        "start": 5462999,
        "end": 5470606
    }, {
        "filename": pL+"fractions.pyc",
        "start": 5470606,
        "end": 5499987
    }, {
        "filename": pL+"ftplib.pyc",
        "start": 5499987,
        "end": 5547466
    }, {
        "filename": pL+"functools.pyc",
        "start": 5547466,
        "end": 5594279
    }, {
        "filename": pL+"future/__init__.pyc",
        "start": 5594279,
        "end": 5597504
    }, {
        "filename": pL+"future/backports/__init__.pyc",
        "start": 5597504,
        "end": 5598404
    }, {
        "filename": pL+"future/backports/_markupbase.pyc",
        "start": 5598404,
        "end": 5614975
    }, {
        "filename": pL+"future/backports/datetime.pyc",
        "start": 5614975,
        "end": 5700177
    }, {
        "filename": pL+"future/backports/email/__init__.pyc",
        "start": 5700177,
        "end": 5702787
    }, {
        "filename": pL+"future/backports/email/_encoded_words.pyc",
        "start": 5702787,
        "end": 5712678
    }, {
        "filename": pL+"future/backports/email/_header_value_parser.pyc",
        "start": 5712678,
        "end": 5864261
    }, {
        "filename": pL+"future/backports/email/_parseaddr.pyc",
        "start": 5864261,
        "end": 5888884
    }, {
        "filename": pL+"future/backports/email/_policybase.pyc",
        "start": 5888884,
        "end": 5908091
    }, {
        "filename": pL+"future/backports/email/base64mime.pyc",
        "start": 5908091,
        "end": 5912823
    }, {
        "filename": pL+"future/backports/email/charset.pyc",
        "start": 5912823,
        "end": 5929494
    }, {
        "filename": pL+"future/backports/email/encoders.pyc",
        "start": 5929494,
        "end": 5933233
    }, {
        "filename": pL+"future/backports/email/errors.pyc",
        "start": 5933233,
        "end": 5941457
    }, {
        "filename": pL+"future/backports/email/feedparser.pyc",
        "start": 5941457,
        "end": 5962868
    }, {
        "filename": pL+"future/backports/email/generator.pyc",
        "start": 5962868,
        "end": 5983752
    }, {
        "filename": pL+"future/backports/email/header.pyc",
        "start": 5983752,
        "end": 6011542
    }, {
        "filename": pL+"future/backports/email/headerregistry.pyc",
        "start": 6011542,
        "end": 6044237
    }, {
        "filename": pL+"future/backports/email/iterators.pyc",
        "start": 6044237,
        "end": 6047735
    }, {
        "filename": pL+"future/backports/email/message.pyc",
        "start": 6047735,
        "end": 6090449
    }, {
        "filename": pL+"future/backports/email/mime/__init__.pyc",
        "start": 6090449,
        "end": 6090672
    }, {
        "filename": pL+"future/backports/email/mime/application.pyc",
        "start": 6090672,
        "end": 6092710
    }, {
        "filename": pL+"future/backports/email/mime/audio.pyc",
        "start": 6092710,
        "end": 6096204
    }, {
        "filename": pL+"future/backports/email/mime/base.pyc",
        "start": 6096204,
        "end": 6097657
    }, {
        "filename": pL+"future/backports/email/mime/image.pyc",
        "start": 6097657,
        "end": 6100193
    }, {
        "filename": pL+"future/backports/email/mime/message.pyc",
        "start": 6100193,
        "end": 6102158
    }, {
        "filename": pL+"future/backports/email/mime/multipart.pyc",
        "start": 6102158,
        "end": 6104237
    }, {
        "filename": pL+"future/backports/email/mime/nonmultipart.pyc",
        "start": 6104237,
        "end": 6105495
    }, {
        "filename": pL+"future/backports/email/mime/text.pyc",
        "start": 6105495,
        "end": 6107446
    }, {
        "filename": pL+"future/backports/email/parser.pyc",
        "start": 6107446,
        "end": 6115323
    }, {
        "filename": pL+"future/backports/email/policy.pyc",
        "start": 6115323,
        "end": 6126426
    }, {
        "filename": pL+"future/backports/email/quoprimime.pyc",
        "start": 6126426,
        "end": 6140473
    }, {
        "filename": pL+"future/backports/email/utils.pyc",
        "start": 6140473,
        "end": 6157009
    }, {
        "filename": pL+"future/backports/html/__init__.pyc",
        "start": 6157009,
        "end": 6158546
    }, {
        "filename": pL+"future/backports/html/entities.pyc",
        "start": 6158546,
        "end": 6258294
    }, {
        "filename": pL+"future/backports/html/parser.pyc",
        "start": 6258294,
        "end": 6282655
    }, {
        "filename": pL+"future/backports/http/__init__.pyc",
        "start": 6282655,
        "end": 6282872
    }, {
        "filename": pL+"future/backports/http/client.pyc",
        "start": 6282872,
        "end": 6335574
    }, {
        "filename": pL+"future/backports/http/cookiejar.pyc",
        "start": 6335574,
        "end": 6423713
    }, {
        "filename": pL+"future/backports/http/cookies.pyc",
        "start": 6423713,
        "end": 6450099
    }, {
        "filename": pL+"future/backports/http/server.pyc",
        "start": 6450099,
        "end": 6505290
    }, {
        "filename": pL+"future/backports/misc.pyc",
        "start": 6505290,
        "end": 6547899
    }, {
        "filename": pL+"future/backports/socket.pyc",
        "start": 6547899,
        "end": 6568529
    }, {
        "filename": pL+"future/backports/socketserver.pyc",
        "start": 6568529,
        "end": 6598993
    }, {
        "filename": pL+"future/backports/test/__init__.pyc",
        "start": 6598993,
        "end": 6599492
    }, {
        "filename": pL+"future/backports/test/badcert.pem.pyc",
        "start": 6599492,
        "end": 6601420
    }, {
        "filename": pL+"future/backports/test/badkey.pem.pyc",
        "start": 6601420,
        "end": 6603582
    }, {
        "filename": pL+"future/backports/test/dh512.pem.pyc",
        "start": 6603582,
        "end": 6603984
    }, {
        "filename": pL+"future/backports/test/https_svn_python_org_root.pem.pyc",
        "start": 6603984,
        "end": 6606553
    }, {
        "filename": pL+"future/backports/test/keycert.passwd.pem.pyc",
        "start": 6606553,
        "end": 6608383
    }, {
        "filename": pL+"future/backports/test/keycert.pem.pyc",
        "start": 6608383,
        "end": 6610166
    }, {
        "filename": pL+"future/backports/test/keycert2.pem.pyc",
        "start": 6610166,
        "end": 6611961
    }, {
        "filename": pL+"future/backports/test/nokia.pem.pyc",
        "start": 6611961,
        "end": 6613884
    }, {
        "filename": pL+"future/backports/test/nullbytecert.pem.pyc",
        "start": 6613884,
        "end": 6619319
    }, {
        "filename": pL+"future/backports/test/nullcert.pem.pyc",
        "start": 6619319,
        "end": 6619319
    }, {
        "filename": pL+"future/backports/test/pystone.pyc",
        "start": 6619319,
        "end": 6630337
    }, {
        "filename": pL+"future/backports/test/sha256.pem.pyc",
        "start": 6630337,
        "end": 6638681
    }, {
        "filename": pL+"future/backports/test/ssl_cert.pem.pyc",
        "start": 6638681,
        "end": 6639548
    }, {
        "filename": pL+"future/backports/test/ssl_key.passwd.pem.pyc",
        "start": 6639548,
        "end": 6640511
    }, {
        "filename": pL+"future/backports/test/ssl_key.pem.pyc",
        "start": 6640511,
        "end": 6641427
    }, {
        "filename": pL+"future/backports/test/ssl_servers.pyc",
        "start": 6641427,
        "end": 6653992
    }, {
        "filename": pL+"future/backports/test/support.pyc",
        "start": 6653992,
        "end": 6744329
    }, {
        "filename": pL+"future/backports/total_ordering.pyc",
        "start": 6744329,
        "end": 6747770
    }, {
        "filename": pL+"future/backports/urllib/__init__.pyc",
        "start": 6747770,
        "end": 6747989
    }, {
        "filename": pL+"future/backports/urllib/error.pyc",
        "start": 6747989,
        "end": 6751549
    }, {
        "filename": pL+"future/backports/urllib/parse.pyc",
        "start": 6751549,
        "end": 6797818
    }, {
        "filename": pL+"future/backports/urllib/request.pyc",
        "start": 6797818,
        "end": 6919347
    }, {
        "filename": pL+"future/backports/urllib/response.pyc",
        "start": 6919347,
        "end": 6925008
    }, {
        "filename": pL+"future/backports/urllib/robotparser.pyc",
        "start": 6925008,
        "end": 6935594
    }, {
        "filename": pL+"future/backports/xmlrpc/__init__.pyc",
        "start": 6935594,
        "end": 6935813
    }, {
        "filename": pL+"future/backports/xmlrpc/client.pyc",
        "start": 6935813,
        "end": 6990560
    }, {
        "filename": pL+"future/backports/xmlrpc/server.pyc",
        "start": 6990560,
        "end": 7037092
    }, {
        "filename": pL+"future/builtins/__init__.pyc",
        "start": 7037092,
        "end": 7038858
    }, {
        "filename": pL+"future/builtins/disabled.pyc",
        "start": 7038858,
        "end": 7041534
    }, {
        "filename": pL+"future/builtins/iterators.pyc",
        "start": 7041534,
        "end": 7043297
    }, {
        "filename": pL+"future/builtins/misc.pyc",
        "start": 7043297,
        "end": 7047456
    }, {
        "filename": pL+"future/builtins/new_min_max.pyc",
        "start": 7047456,
        "end": 7050438
    }, {
        "filename": pL+"future/builtins/newnext.pyc",
        "start": 7050438,
        "end": 7052989
    }, {
        "filename": pL+"future/builtins/newround.pyc",
        "start": 7052989,
        "end": 7057204
    }, {
        "filename": pL+"future/builtins/newsuper.pyc",
        "start": 7057204,
        "end": 7061835
    }, {
        "filename": pL+"future/moves/__init__.pyc",
        "start": 7061835,
        "end": 7062370
    }, {
        "filename": pL+"future/moves/_dummy_thread.pyc",
        "start": 7062370,
        "end": 7062829
    }, {
        "filename": pL+"future/moves/_markupbase.pyc",
        "start": 7062829,
        "end": 7063282
    }, {
        "filename": pL+"future/moves/_thread.pyc",
        "start": 7063282,
        "end": 7063723
    }, {
        "filename": pL+"future/moves/builtins.pyc",
        "start": 7063723,
        "end": 7064208
    }, {
        "filename": pL+"future/moves/collections.pyc",
        "start": 7064208,
        "end": 7065074
    }, {
        "filename": pL+"future/moves/configparser.pyc",
        "start": 7065074,
        "end": 7065501
    }, {
        "filename": pL+"future/moves/copyreg.pyc",
        "start": 7065501,
        "end": 7066035
    }, {
        "filename": pL+"future/moves/dbm/__init__.pyc",
        "start": 7066035,
        "end": 7066714
    }, {
        "filename": pL+"future/moves/dbm/dumb.pyc",
        "start": 7066714,
        "end": 7067158
    }, {
        "filename": pL+"future/moves/dbm/gnu.pyc",
        "start": 7067158,
        "end": 7067597
    }, {
        "filename": pL+"future/moves/dbm/ndbm.pyc",
        "start": 7067597,
        "end": 7068037
    }, {
        "filename": pL+"future/moves/html/__init__.pyc",
        "start": 7068037,
        "end": 7069275
    }, {
        "filename": pL+"future/moves/html/entities.pyc",
        "start": 7069275,
        "end": 7069736
    }, {
        "filename": pL+"future/moves/html/parser.pyc",
        "start": 7069736,
        "end": 7070189
    }, {
        "filename": pL+"future/moves/http/__init__.pyc",
        "start": 7070189,
        "end": 7070512
    }, {
        "filename": pL+"future/moves/http/client.pyc",
        "start": 7070512,
        "end": 7070946
    }, {
        "filename": pL+"future/moves/http/cookiejar.pyc",
        "start": 7070946,
        "end": 7071404
    }, {
        "filename": pL+"future/moves/http/cookies.pyc",
        "start": 7071404,
        "end": 7071900
    }, {
        "filename": pL+"future/moves/http/server.pyc",
        "start": 7071900,
        "end": 7072762
    }, {
        "filename": pL+"future/moves/itertools.pyc",
        "start": 7072762,
        "end": 7073229
    }, {
        "filename": pL+"future/moves/pickle.pyc",
        "start": 7073229,
        "end": 7073781
    }, {
        "filename": pL+"future/moves/queue.pyc",
        "start": 7073781,
        "end": 7074217
    }, {
        "filename": pL+"future/moves/reprlib.pyc",
        "start": 7074217,
        "end": 7074656
    }, {
        "filename": pL+"future/moves/socketserver.pyc",
        "start": 7074656,
        "end": 7075113
    }, {
        "filename": pL+"future/moves/subprocess.pyc",
        "start": 7075113,
        "end": 7075733
    }, {
        "filename": pL+"future/moves/sys.pyc",
        "start": 7075733,
        "end": 7076170
    }, {
        "filename": pL+"future/moves/test/__init__.pyc",
        "start": 7076170,
        "end": 7076559
    }, {
        "filename": pL+"future/moves/test/support.pyc",
        "start": 7076559,
        "end": 7077287
    }, {
        "filename": pL+"future/moves/tkinter/__init__.pyc",
        "start": 7077287,
        "end": 7078386
    }, {
        "filename": pL+"future/moves/tkinter/colorchooser.pyc",
        "start": 7078386,
        "end": 7079034
    }, {
        "filename": pL+"future/moves/tkinter/commondialog.pyc",
        "start": 7079034,
        "end": 7079682
    }, {
        "filename": pL+"future/moves/tkinter/constants.pyc",
        "start": 7079682,
        "end": 7080318
    }, {
        "filename": pL+"future/moves/tkinter/dialog.pyc",
        "start": 7080318,
        "end": 7080938
    }, {
        "filename": pL+"future/moves/tkinter/dnd.pyc",
        "start": 7080938,
        "end": 7081550
    }, {
        "filename": pL+"future/moves/tkinter/filedialog.pyc",
        "start": 7081550,
        "end": 7082414
    }, {
        "filename": pL+"future/moves/tkinter/font.pyc",
        "start": 7082414,
        "end": 7083030
    }, {
        "filename": pL+"future/moves/tkinter/messagebox.pyc",
        "start": 7083030,
        "end": 7083670
    }, {
        "filename": pL+"future/moves/tkinter/scrolledtext.pyc",
        "start": 7083670,
        "end": 7084314
    }, {
        "filename": pL+"future/moves/tkinter/simpledialog.pyc",
        "start": 7084314,
        "end": 7084958
    }, {
        "filename": pL+"future/moves/tkinter/tix.pyc",
        "start": 7084958,
        "end": 7085566
    }, {
        "filename": pL+"future/moves/tkinter/ttk.pyc",
        "start": 7085566,
        "end": 7086174
    }, {
        "filename": pL+"future/moves/urllib/__init__.pyc",
        "start": 7086174,
        "end": 7086565
    }, {
        "filename": pL+"future/moves/urllib/error.pyc",
        "start": 7086565,
        "end": 7087409
    }, {
        "filename": pL+"future/moves/urllib/parse.pyc",
        "start": 7087409,
        "end": 7088652
    }, {
        "filename": pL+"future/moves/urllib/request.pyc",
        "start": 7088652,
        "end": 7090347
    }, {
        "filename": pL+"future/moves/urllib/response.pyc",
        "start": 7090347,
        "end": 7091155
    }, {
        "filename": pL+"future/moves/urllib/robotparser.pyc",
        "start": 7091155,
        "end": 7091623
    }, {
        "filename": pL+"future/moves/winreg.pyc",
        "start": 7091623,
        "end": 7092063
    }, {
        "filename": pL+"future/moves/xmlrpc/__init__.pyc",
        "start": 7092063,
        "end": 7092278
    }, {
        "filename": pL+"future/moves/xmlrpc/client.pyc",
        "start": 7092278,
        "end": 7092704
    }, {
        "filename": pL+"future/moves/xmlrpc/server.pyc",
        "start": 7092704,
        "end": 7093130
    }, {
        "filename": pL+"future/standard_library/__init__.pyc",
        "start": 7093130,
        "end": 7121870
    }, {
        "filename": pL+"future/tests/__init__.pyc",
        "start": 7121870,
        "end": 7122078
    }, {
        "filename": pL+"future/tests/base.pyc",
        "start": 7122078,
        "end": 7149270
    }, {
        "filename": pL+"future/types/__init__.pyc",
        "start": 7149270,
        "end": 7156678
    }, {
        "filename": pL+"future/types/newbytes.pyc",
        "start": 7156678,
        "end": 7182014
    }, {
        "filename": pL+"future/types/newdict.pyc",
        "start": 7182014,
        "end": 7185204
    }, {
        "filename": pL+"future/types/newint.pyc",
        "start": 7185204,
        "end": 7206934
    }, {
        "filename": pL+"future/types/newlist.pyc",
        "start": 7206934,
        "end": 7211660
    }, {
        "filename": pL+"future/types/newmemoryview.pyc",
        "start": 7211660,
        "end": 7212920
    }, {
        "filename": pL+"future/types/newobject.pyc",
        "start": 7212920,
        "end": 7216535
    }, {
        "filename": pL+"future/types/newopen.pyc",
        "start": 7216535,
        "end": 7218756
    }, {
        "filename": pL+"future/types/newrange.pyc",
        "start": 7218756,
        "end": 7227782
    }, {
        "filename": pL+"future/types/newstr.pyc",
        "start": 7227782,
        "end": 7252189
    }, {
        "filename": pL+"future/utils/__init__.pyc",
        "start": 7252189,
        "end": 7280409
    }, {
        "filename": pL+"future/utils/surrogateescape.pyc",
        "start": 7280409,
        "end": 7287396
    }, {
        "filename": pL+"genericpath.pyc",
        "start": 7287396,
        "end": 7293607
    }, {
        "filename": pL+"getopt.pyc",
        "start": 7293607,
        "end": 7303445
    }, {
        "filename": pL+"getpass.pyc",
        "start": 7303445,
        "end": 7311020
    }, {
        "filename": pL+"gettext.pyc",
        "start": 7311020,
        "end": 7334704
    }, {
        "filename": pL+"glob.pyc",
        "start": 7334704,
        "end": 7345912
    }, {
        "filename": pL+"graphlib.pyc",
        "start": 7345912,
        "end": 7357071
    }, {
        "filename": pL+"gzip.pyc",
        "start": 7357071,
        "end": 7391023
    }, {
        "filename": pL+"hashlib.pyc",
        "start": 7391023,
        "end": 7403440
    }, {
        "filename": pL+"heapq.pyc",
        "start": 7403440,
        "end": 7424133
    }, {
        "filename": pL+"hmac.pyc",
        "start": 7424133,
        "end": 7435661
    }, {
        "filename": pL+"html/__init__.pyc",
        "start": 7435661,
        "end": 7440547
    }, {
        "filename": pL+"html/entities.pyc",
        "start": 7440547,
        "end": 7540031
    }, {
        "filename": pL+"html/parser.pyc",
        "start": 7540031,
        "end": 7559607
    }, {
        "filename": pL+"http/__init__.pyc",
        "start": 7559607,
        "end": 7568379
    }, {
        "filename": pL+"http/client.pyc",
        "start": 7568379,
        "end": 7628730
    }, {
        "filename": pL+"http/cookiejar.pyc",
        "start": 7628730,
        "end": 7717354
    }, {
        "filename": pL+"http/cookies.pyc",
        "start": 7717354,
        "end": 7741190
    }, {
        "filename": pL+"http/server.pyc",
        "start": 7741190,
        "end": 7799939
    }, {
        "filename": pL+"idna/__init__.pyc",
        "start": 7799939,
        "end": 7800232
    }, {
        "filename": pL+"idna/codec.pyc",
        "start": 7800232,
        "end": 7805367
    }, {
        "filename": pL+"idna/compat.pyc",
        "start": 7805367,
        "end": 7806152
    }, {
        "filename": pL+"idna/core.pyc",
        "start": 7806152,
        "end": 7823846
    }, {
        "filename": pL+"idna/idnadata.pyc",
        "start": 7823846,
        "end": 7850394
    }, {
        "filename": pL+"idna/intranges.pyc",
        "start": 7850394,
        "end": 7853062
    }, {
        "filename": pL+"idna/package_data.pyc",
        "start": 7853062,
        "end": 7853284
    }, {
        "filename": pL+"idna/uts46data.pyc",
        "start": 7853284,
        "end": 7990254
    }, {
        "filename": pL+"imaplib.pyc",
        "start": 7990254,
        "end": 8059123
    }, {
        "filename": pL+"imghdr.pyc",
        "start": 8059123,
        "end": 8067061
    }, {
        "filename": pL+"imp.pyc",
        "start": 8067061,
        "end": 8083605
    }, {
        "filename": pL+"importlib/__init__.pyc",
        "start": 8083605,
        "end": 8090326
    }, {
        "filename": pL+"importlib/_abc.pyc",
        "start": 8090326,
        "end": 8092710
    }, {
        "filename": pL+"importlib/_bootstrap.pyc",
        "start": 8092710,
        "end": 8150819
    }, {
        "filename": pL+"importlib/_bootstrap_external.pyc",
        "start": 8150819,
        "end": 8223252
    }, {
        "filename": pL+"importlib/abc.pyc",
        "start": 8223252,
        "end": 8237800
    }, {
        "filename": pL+"importlib/machinery.pyc",
        "start": 8237800,
        "end": 8239141
    }, {
        "filename": pL+"importlib/metadata/__init__.pyc",
        "start": 8239141,
        "end": 8297591
    }, {
        "filename": pL+"importlib/metadata/_adapters.pyc",
        "start": 8297591,
        "end": 8301428
    }, {
        "filename": pL+"importlib/metadata/_collections.pyc",
        "start": 8301428,
        "end": 8303608
    }, {
        "filename": pL+"importlib/metadata/_functools.pyc",
        "start": 8303608,
        "end": 8307232
    }, {
        "filename": pL+"importlib/metadata/_itertools.pyc",
        "start": 8307232,
        "end": 8309828
    }, {
        "filename": pL+"importlib/metadata/_meta.pyc",
        "start": 8309828,
        "end": 8312779
    }, {
        "filename": pL+"importlib/metadata/_text.pyc",
        "start": 8312779,
        "end": 8317157
    }, {
        "filename": pL+"importlib/readers.pyc",
        "start": 8317157,
        "end": 8317727
    }, {
        "filename": pL+"importlib/resources/__init__.pyc",
        "start": 8317727,
        "end": 8318542
    }, {
        "filename": pL+"importlib/resources/_adapters.pyc",
        "start": 8318542,
        "end": 8329283
    }, {
        "filename": pL+"importlib/resources/_common.pyc",
        "start": 8329283,
        "end": 8333566
    }, {
        "filename": pL+"importlib/resources/_itertools.pyc",
        "start": 8333566,
        "end": 8334949
    }, {
        "filename": pL+"importlib/resources/_legacy.pyc",
        "start": 8334949,
        "end": 8341424
    }, {
        "filename": pL+"importlib/resources/abc.pyc",
        "start": 8341424,
        "end": 8349963
    }, {
        "filename": pL+"importlib/resources/readers.pyc",
        "start": 8349963,
        "end": 8358305
    }, {
        "filename": pL+"importlib/resources/simple.pyc",
        "start": 8358305,
        "end": 8365221
    }, {
        "filename": pL+"importlib/simple.pyc",
        "start": 8365221,
        "end": 8365802
    }, {
        "filename": pL+"importlib/util.pyc",
        "start": 8365802,
        "end": 8380323
    }, {
        "filename": pL+"inspect.pyc",
        "start": 8380323,
        "end": 8521696
    }, {
        "filename": pL+"io.pyc",
        "start": 8521696,
        "end": 8526760
    }, {
        "filename": pL+"ipaddress.pyc",
        "start": 8526760,
        "end": 8620512
    }, {
        "filename": pL+"jnius/__init__.pyc",
        "start": 8620512,
        "end": 8622825
    }, {
        "filename": pL+"jnius/env.pyc",
        "start": 8622825,
        "end": 8627241
    }, {
        "filename": pL+"jnius/reflect.pyc",
        "start": 8627241,
        "end": 8635825
    }, {
        "filename": pL+"jnius/signatures.pyc",
        "start": 8635825,
        "end": 8638925
    }, {
        "filename": pL+"json/__init__.pyc",
        "start": 8638925,
        "end": 8653293
    }, {
        "filename": pL+"json/decoder.pyc",
        "start": 8653293,
        "end": 8668653
    }, {
        "filename": pL+"json/encoder.pyc",
        "start": 8668653,
        "end": 8685604
    }, {
        "filename": pL+"json/scanner.pyc",
        "start": 8685604,
        "end": 8689334
    }, {
        "filename": pL+"json/tool.pyc",
        "start": 8689334,
        "end": 8694132
    }, {
        "filename": pL+"keyword.pyc",
        "start": 8694132,
        "end": 8695241
    }, {
        "filename": pL+"lib-dynload/empty.txt",
        "start": 8695241,
        "end": 8695298
    }, {
        "filename": pL+"linecache.pyc",
        "start": 8695298,
        "end": 8702860
    }, {
        "filename": pL+"locale.pyc",
        "start": 8702860,
        "end": 8767347
    }, {
        "filename": pL+"logging/__init__.pyc",
        "start": 8767347,
        "end": 8866474
    }, {
        "filename": pL+"logging/config.pyc",
        "start": 8866474,
        "end": 8910806
    }, {
        "filename": pL+"logging/handlers.pyc",
        "start": 8910806,
        "end": 8981075
    }, {
        "filename": pL+"lzma.pyc",
        "start": 8981075,
        "end": 8997889
    }, {
        "filename": pL+"mimetypes.pyc",
        "start": 8997889,
        "end": 9023853
    }, {
        "filename": pL+"modulefinder.pyc",
        "start": 9023853,
        "end": 9055061
    }, {
        "filename": pL+"multiprocessing/__init__.pyc",
        "start": 9055061,
        "end": 9056215
    }, {
        "filename": pL+"multiprocessing/connection.pyc",
        "start": 9056215,
        "end": 9105074
    }, {
        "filename": pL+"multiprocessing/context.pyc",
        "start": 9105074,
        "end": 9124714
    }, {
        "filename": pL+"multiprocessing/dummy/__init__.pyc",
        "start": 9124714,
        "end": 9130995
    }, {
        "filename": pL+"multiprocessing/dummy/connection.pyc",
        "start": 9130995,
        "end": 9135014
    }, {
        "filename": pL+"multiprocessing/forkserver.pyc",
        "start": 9135014,
        "end": 9152131
    }, {
        "filename": pL+"multiprocessing/heap.pyc",
        "start": 9152131,
        "end": 9166896
    }, {
        "filename": pL+"multiprocessing/managers.pyc",
        "start": 9166896,
        "end": 9240631
    }, {
        "filename": pL+"multiprocessing/pool.pyc",
        "start": 9240631,
        "end": 9288197
    }, {
        "filename": pL+"multiprocessing/popen_fork.pyc",
        "start": 9288197,
        "end": 9292627
    }, {
        "filename": pL+"multiprocessing/popen_forkserver.pyc",
        "start": 9292627,
        "end": 9297008
    }, {
        "filename": pL+"multiprocessing/popen_spawn_posix.pyc",
        "start": 9297008,
        "end": 9301476
    }, {
        "filename": pL+"multiprocessing/popen_spawn_win32.pyc",
        "start": 9301476,
        "end": 9308032
    }, {
        "filename": pL+"multiprocessing/process.pyc",
        "start": 9308032,
        "end": 9327272
    }, {
        "filename": pL+"multiprocessing/queues.pyc",
        "start": 9327272,
        "end": 9347344
    }, {
        "filename": pL+"multiprocessing/reduction.pyc",
        "start": 9347344,
        "end": 9362407
    }, {
        "filename": pL+"multiprocessing/resource_sharer.pyc",
        "start": 9362407,
        "end": 9372438
    }, {
        "filename": pL+"multiprocessing/resource_tracker.pyc",
        "start": 9372438,
        "end": 9383866
    }, {
        "filename": pL+"multiprocessing/shared_memory.pyc",
        "start": 9383866,
        "end": 9408358
    }, {
        "filename": pL+"multiprocessing/sharedctypes.pyc",
        "start": 9408358,
        "end": 9420477
    }, {
        "filename": pL+"multiprocessing/spawn.pyc",
        "start": 9420477,
        "end": 9433116
    }, {
        "filename": pL+"multiprocessing/synchronize.pyc",
        "start": 9433116,
        "end": 9455373
    }, {
        "filename": pL+"multiprocessing/util.pyc",
        "start": 9455373,
        "end": 9475840
    }, {
        "filename": pL+"netrc.pyc",
        "start": 9475840,
        "end": 9485860
    }, {
        "filename": pL+"ntpath.pyc",
        "start": 9485860,
        "end": 9516591
    }, {
        "filename": pL+"nturl2path.pyc",
        "start": 9516591,
        "end": 9520148
    }, {
        "filename": pL+"numbers.pyc",
        "start": 9520148,
        "end": 9535439
    }, {
        "filename": pL+"opcode.pyc",
        "start": 9535439,
        "end": 9549332
    }, {
        "filename": pL+"operator.pyc",
        "start": 9549332,
        "end": 9568149
    }, {
        "filename": pL+"optparse.pyc",
        "start": 9568149,
        "end": 9642221
    }, {
        "filename": pL+"ordlookup/__init__.pyc",
        "start": 9642221,
        "end": 9643806
    }, {
        "filename": pL+"ordlookup/oleaut32.pyc",
        "start": 9643806,
        "end": 9663249
    }, {
        "filename": pL+"ordlookup/ws2_32.pyc",
        "start": 9663249,
        "end": 9668673
    }, {
        "filename": pL+"os.pyc",
        "start": 9668673,
        "end": 9717740
    }, {
        "filename": pL+"past/__init__.pyc",
        "start": 9717740,
        "end": 9720926
    }, {
        "filename": pL+"past/builtins/__init__.pyc",
        "start": 9720926,
        "end": 9722984
    }, {
        "filename": pL+"past/builtins/misc.pyc",
        "start": 9722984,
        "end": 9730773
    }, {
        "filename": pL+"past/builtins/noniterators.pyc",
        "start": 9730773,
        "end": 9735434
    }, {
        "filename": pL+"past/translation/__init__.pyc",
        "start": 9735434,
        "end": 9754868
    }, {
        "filename": pL+"past/types/__init__.pyc",
        "start": 9754868,
        "end": 9755979
    }, {
        "filename": pL+"past/types/basestring.pyc",
        "start": 9755979,
        "end": 9757966
    }, {
        "filename": pL+"past/types/olddict.pyc",
        "start": 9757966,
        "end": 9761334
    }, {
        "filename": pL+"past/types/oldstr.pyc",
        "start": 9761334,
        "end": 9765776
    }, {
        "filename": pL+"past/utils/__init__.pyc",
        "start": 9765776,
        "end": 9769561
    }, {
        "filename": pL+"pathlib.pyc",
        "start": 9769561,
        "end": 9837575
    }, {
        "filename": pL+"pdb.pyc",
        "start": 9837575,
        "end": 9923102
    }, {
        "filename": pL+"pefile.pyc",
        "start": 9923102,
        "end": 10193921
    }, {
        "filename": pL+"pickle.pyc",
        "start": 10193921,
        "end": 10281101
    }, {
        "filename": pL+"pickletools.pyc",
        "start": 10281101,
        "end": 10367625
    }, {
        "filename": pL+"pipes.pyc",
        "start": 10367625,
        "end": 10379738
    }, {
        "filename": pL+"pkgutil.pyc",
        "start": 10379738,
        "end": 10411477
    }, {
        "filename": pL+"platform.pyc",
        "start": 10411477,
        "end": 10455287
    }, {
        "filename": pL+"plistlib.pyc",
        "start": 10455287,
        "end": 10501356
    }, {
        "filename": pL+"poplib.pyc",
        "start": 10501356,
        "end": 10522433
    }, {
        "filename": pL+"posixpath.pyc",
        "start": 10522433,
        "end": 10542469
    }, {
        "filename": pL+"pprint.pyc",
        "start": 10542469,
        "end": 10576095
    }, {
        "filename": pL+"profile.pyc",
        "start": 10576095,
        "end": 10600137
    }, {
        "filename": pL+"pstats.pyc",
        "start": 10600137,
        "end": 10642179
    }, {
        "filename": pL+"pty.pyc",
        "start": 10642179,
        "end": 10649749
    }, {
        "filename": pL+"py_compile.pyc",
        "start": 10649749,
        "end": 10660588
    }, {
        "filename": pL+"pyasn1/__init__.pyc",
        "start": 10660588,
        "end": 10661029
    }, {
        "filename": pL+"pyasn1/codec/__init__.pyc",
        "start": 10661029,
        "end": 10661237
    }, {
        "filename": pL+"pyasn1/codec/ber/__init__.pyc",
        "start": 10661237,
        "end": 10661449
    }, {
        "filename": pL+"pyasn1/codec/ber/decoder.pyc",
        "start": 10661449,
        "end": 10714841
    }, {
        "filename": pL+"pyasn1/codec/ber/encoder.pyc",
        "start": 10714841,
        "end": 10742971
    }, {
        "filename": pL+"pyasn1/codec/ber/eoo.pyc",
        "start": 10742971,
        "end": 10744150
    }, {
        "filename": pL+"pyasn1/codec/cer/__init__.pyc",
        "start": 10744150,
        "end": 10744362
    }, {
        "filename": pL+"pyasn1/codec/cer/decoder.pyc",
        "start": 10744362,
        "end": 10747204
    }, {
        "filename": pL+"pyasn1/codec/cer/encoder.pyc",
        "start": 10747204,
        "end": 10758701
    }, {
        "filename": pL+"pyasn1/codec/der/__init__.pyc",
        "start": 10758701,
        "end": 10758913
    }, {
        "filename": pL+"pyasn1/codec/der/decoder.pyc",
        "start": 10758913,
        "end": 10760799
    }, {
        "filename": pL+"pyasn1/codec/der/encoder.pyc",
        "start": 10760799,
        "end": 10763568
    }, {
        "filename": pL+"pyasn1/codec/native/__init__.pyc",
        "start": 10763568,
        "end": 10763783
    }, {
        "filename": pL+"pyasn1/codec/native/decoder.pyc",
        "start": 10763783,
        "end": 10773912
    }, {
        "filename": pL+"pyasn1/codec/native/encoder.pyc",
        "start": 10773912,
        "end": 10785180
    }, {
        "filename": pL+"pyasn1/compat/__init__.pyc",
        "start": 10785180,
        "end": 10785389
    }, {
        "filename": pL+"pyasn1/compat/binary.pyc",
        "start": 10785389,
        "end": 10786400
    }, {
        "filename": pL+"pyasn1/compat/calling.pyc",
        "start": 10786400,
        "end": 10787091
    }, {
        "filename": pL+"pyasn1/compat/dateandtime.pyc",
        "start": 10787091,
        "end": 10787967
    }, {
        "filename": pL+"pyasn1/compat/integer.pyc",
        "start": 10787967,
        "end": 10792202
    }, {
        "filename": pL+"pyasn1/compat/octets.pyc",
        "start": 10792202,
        "end": 10794919
    }, {
        "filename": pL+"pyasn1/compat/string.pyc",
        "start": 10794919,
        "end": 10795814
    }, {
        "filename": pL+"pyasn1/debug.pyc",
        "start": 10795814,
        "end": 10802612
    }, {
        "filename": pL+"pyasn1/error.pyc",
        "start": 10802612,
        "end": 10803898
    }, {
        "filename": pL+"pyasn1/type/__init__.pyc",
        "start": 10803898,
        "end": 10804105
    }, {
        "filename": pL+"pyasn1/type/base.pyc",
        "start": 10804105,
        "end": 10832753
    }, {
        "filename": pL+"pyasn1/type/char.pyc",
        "start": 10832753,
        "end": 10845427
    }, {
        "filename": pL+"pyasn1/type/constraint.pyc",
        "start": 10845427,
        "end": 10868212
    }, {
        "filename": pL+"pyasn1/type/error.pyc",
        "start": 10868212,
        "end": 10868721
    }, {
        "filename": pL+"pyasn1/type/namedtype.pyc",
        "start": 10868721,
        "end": 10894846
    }, {
        "filename": pL+"pyasn1/type/namedval.pyc",
        "start": 10894846,
        "end": 10903352
    }, {
        "filename": pL+"pyasn1/type/opentype.pyc",
        "start": 10903352,
        "end": 10906349
    }, {
        "filename": pL+"pyasn1/type/tag.pyc",
        "start": 10906349,
        "end": 10919869
    }, {
        "filename": pL+"pyasn1/type/tagmap.pyc",
        "start": 10919869,
        "end": 10924367
    }, {
        "filename": pL+"pyasn1/type/univ.pyc",
        "start": 10924367,
        "end": 11054121
    }, {
        "filename": pL+"pyasn1/type/useful.pyc",
        "start": 11054121,
        "end": 11062074
    }, {
        "filename": pL+"pyclbr.pyc",
        "start": 11062074,
        "end": 11078050
    }, {
        "filename": pL+"pydoc.pyc",
        "start": 11078050,
        "end": 11232640
    }, {
        "filename": pL+"pygame_sdl2/__init__.pyc",
        "start": 11232640,
        "end": 11238725
    }, {
        "filename": pL+"pygame_sdl2/compat.pyc",
        "start": 11238725,
        "end": 11243167
    }, {
        "filename": pL+"pygame_sdl2/sprite.pyc",
        "start": 11243167,
        "end": 11308240
    }, {
        "filename": pL+"pygame_sdl2/sysfont.pyc",
        "start": 11308240,
        "end": 11332006
    }, {
        "filename": pL+"pygame_sdl2/threads/Py25Queue.pyc",
        "start": 11332006,
        "end": 11343148
    }, {
        "filename": pL+"pygame_sdl2/threads/__init__.pyc",
        "start": 11343148,
        "end": 11354206
    }, {
        "filename": pL+"pygame_sdl2/time.pyc",
        "start": 11354206,
        "end": 11354459
    }, {
        "filename": pL+"pygame_sdl2/version.pyc",
        "start": 11354459,
        "end": 11355056
    }, {
        "filename": pL+"pyobjus/__init__.pyc",
        "start": 11355056,
        "end": 11355257
    }, {
        "filename": pL+"pyobjus/dylib_manager.pyc",
        "start": 11355257,
        "end": 11364909
    }, {
        "filename": pL+"pyobjus/objc_py_types.pyc",
        "start": 11364909,
        "end": 11372104
    }, {
        "filename": pL+"pyobjus/protocols.pyc",
        "start": 11372104,
        "end": 11454081
    }, {
        "filename": pL+"queue.pyc",
        "start": 11454081,
        "end": 11470621
    }, {
        "filename": pL+"quopri.pyc",
        "start": 11470621,
        "end": 11481675
    }, {
        "filename": pL+"random.pyc",
        "start": 11481675,
        "end": 11516393
    }, {
        "filename": pL+"re/__init__.pyc",
        "start": 11516393,
        "end": 11535757
    }, {
        "filename": pL+"re/_casefix.pyc",
        "start": 11535757,
        "end": 11537644
    }, {
        "filename": pL+"re/_compiler.pyc",
        "start": 11537644,
        "end": 11569757
    }, {
        "filename": pL+"re/_constants.pyc",
        "start": 11569757,
        "end": 11575756
    }, {
        "filename": pL+"re/_parser.pyc",
        "start": 11575756,
        "end": 11626235
    }, {
        "filename": pL+"reprlib.pyc",
        "start": 11626235,
        "end": 11635988
    }, {
        "filename": pL+"requests/__init__.pyc",
        "start": 11635988,
        "end": 11641295
    }, {
        "filename": pL+"requests/__version__.pyc",
        "start": 11641295,
        "end": 11641886
    }, {
        "filename": pL+"requests/_internal_utils.pyc",
        "start": 11641886,
        "end": 11643598
    }, {
        "filename": pL+"requests/adapters.pyc",
        "start": 11643598,
        "end": 11668681
    }, {
        "filename": pL+"requests/api.pyc",
        "start": 11668681,
        "end": 11676017
    }, {
        "filename": pL+"requests/auth.pyc",
        "start": 11676017,
        "end": 11690595
    }, {
        "filename": pL+"requests/certs.pyc",
        "start": 11690595,
        "end": 11691324
    }, {
        "filename": pL+"requests/compat.pyc",
        "start": 11691324,
        "end": 11693769
    }, {
        "filename": pL+"requests/cookies.pyc",
        "start": 11693769,
        "end": 11721034
    }, {
        "filename": pL+"requests/exceptions.pyc",
        "start": 11721034,
        "end": 11728417
    }, {
        "filename": pL+"requests/help.pyc",
        "start": 11728417,
        "end": 11732569
    }, {
        "filename": pL+"requests/hooks.pyc",
        "start": 11732569,
        "end": 11733826
    }, {
        "filename": pL+"requests/models.pyc",
        "start": 11733826,
        "end": 11772470
    }, {
        "filename": pL+"requests/packages.pyc",
        "start": 11772470,
        "end": 11773155
    }, {
        "filename": pL+"requests/sessions.pyc",
        "start": 11773155,
        "end": 11802689
    }, {
        "filename": pL+"requests/status_codes.pyc",
        "start": 11802689,
        "end": 11808874
    }, {
        "filename": pL+"requests/structures.pyc",
        "start": 11808874,
        "end": 11815112
    }, {
        "filename": pL+"requests/utils.pyc",
        "start": 11815112,
        "end": 11851869
    }, {
        "filename": pL+"rlcompleter.pyc",
        "start": 11851869,
        "end": 11860956
    }, {
        "filename": pL+"rsa/__init__.pyc",
        "start": 11860956,
        "end": 11862186
    }, {
        "filename": pL+"rsa/_compat.pyc",
        "start": 11862186,
        "end": 11866085
    }, {
        "filename": pL+"rsa/_version133.pyc",
        "start": 11866085,
        "end": 11882411
    }, {
        "filename": pL+"rsa/_version200.pyc",
        "start": 11882411,
        "end": 11901022
    }, {
        "filename": pL+"rsa/asn1.pyc",
        "start": 11901022,
        "end": 11903387
    }, {
        "filename": pL+"rsa/bigfile.pyc",
        "start": 11903387,
        "end": 11908922
    }, {
        "filename": pL+"rsa/cli.pyc",
        "start": 11908922,
        "end": 11927765
    }, {
        "filename": pL+"rsa/common.pyc",
        "start": 11927765,
        "end": 11932545
    }, {
        "filename": pL+"rsa/core.pyc",
        "start": 11932545,
        "end": 11934386
    }, {
        "filename": pL+"rsa/key.pyc",
        "start": 11934386,
        "end": 11964405
    }, {
        "filename": pL+"rsa/parallel.pyc",
        "start": 11964405,
        "end": 11967453
    }, {
        "filename": pL+"rsa/pem.pyc",
        "start": 11967453,
        "end": 11971348
    }, {
        "filename": pL+"rsa/pkcs1.pyc",
        "start": 11971348,
        "end": 11985143
    }, {
        "filename": pL+"rsa/prime.pyc",
        "start": 11985143,
        "end": 11989361
    }, {
        "filename": pL+"rsa/randnum.pyc",
        "start": 11989361,
        "end": 11991765
    }, {
        "filename": pL+"rsa/transform.pyc",
        "start": 11991765,
        "end": 11998732
    }, {
        "filename": pL+"rsa/util.pyc",
        "start": 11998732,
        "end": 12002687
    }, {
        "filename": pL+"rsa/varblock.pyc",
        "start": 12002687,
        "end": 12008328
    }, {
        "filename": pL+"runpy.pyc",
        "start": 12008328,
        "end": 12024548
    }, {
        "filename": pL+"sched.pyc",
        "start": 12024548,
        "end": 12032996
    }, {
        "filename": pL+"secrets.pyc",
        "start": 12032996,
        "end": 12035904
    }, {
        "filename": pL+"selectors.pyc",
        "start": 12035904,
        "end": 12064339
    }, {
        "filename": pL+"shelve.pyc",
        "start": 12064339,
        "end": 12078259
    }, {
        "filename": pL+"shlex.pyc",
        "start": 12078259,
        "end": 12093144
    }, {
        "filename": pL+"shutil.pyc",
        "start": 12093144,
        "end": 12163840
    }, {
        "filename": pL+"signal.pyc",
        "start": 12163840,
        "end": 12168911
    }, {
        "filename": pL+"site.pyc",
        "start": 12168911,
        "end": 12198885
    }, {
        "filename": pL+"sitecustomize.pyc",
        "start": 12198885,
        "end": 12208414
    }, {
        "filename": pL+"six.pyc",
        "start": 12208414,
        "end": 12252990
    }, {
        "filename": pL+"socket.pyc",
        "start": 12252990,
        "end": 12298616
    }, {
        "filename": pL+"socketserver.pyc",
        "start": 12298616,
        "end": 12335738
    }, {
        "filename": pL+"sre_compile.pyc",
        "start": 12335738,
        "end": 12336596
    }, {
        "filename": pL+"sre_constants.pyc",
        "start": 12336596,
        "end": 12337457
    }, {
        "filename": pL+"sre_parse.pyc",
        "start": 12337457,
        "end": 12338311
    }, {
        "filename": pL+"ssl.pyc",
        "start": 12338311,
        "end": 12410916
    }, {
        "filename": pL+"stat.pyc",
        "start": 12410916,
        "end": 12416497
    }, {
        "filename": pL+"statistics.pyc",
        "start": 12416497,
        "end": 12474747
    }, {
        "filename": pL+"steamapi.pyc",
        "start": 12474747,
        "end": 12990218
    }, {
        "filename": pL+"string.pyc",
        "start": 12990218,
        "end": 13002951
    }, {
        "filename": pL+"stringprep.pyc",
        "start": 13002951,
        "end": 13029526
    }, {
        "filename": pL+"struct.pyc",
        "start": 13029526,
        "end": 13029947
    }, {
        "filename": pL+"subprocess.pyc",
        "start": 13029947,
        "end": 13112527
    }, {
        "filename": pL+"sunau.pyc",
        "start": 13112527,
        "end": 13139670
    }, {
        "filename": pL+"symtable.pyc",
        "start": 13139670,
        "end": 13159282
    }, {
        "filename": pL+"sysconfig.pyc",
        "start": 13159282,
        "end": 13160274
    }, {
        "filename": pL+"tabnanny.pyc",
        "start": 13160274,
        "end": 13173474
    }, {
        "filename": pL+"tarfile.pyc",
        "start": 13173474,
        "end": 13291844
    }, {
        "filename": pL+"tempfile.pyc",
        "start": 13291844,
        "end": 13332645
    }, {
        "filename": pL+"textwrap.pyc",
        "start": 13332645,
        "end": 13352360
    }, {
        "filename": pL+"this.pyc",
        "start": 13352360,
        "end": 13353997
    }, {
        "filename": pL+"threading.pyc",
        "start": 13353997,
        "end": 13424045
    }, {
        "filename": pL+"timeit.pyc",
        "start": 13424045,
        "end": 13440569
    }, {
        "filename": pL+"token.pyc",
        "start": 13440569,
        "end": 13444333
    }, {
        "filename": pL+"tokenize.pyc",
        "start": 13444333,
        "end": 13474919
    }, {
        "filename": pL+"trace.pyc",
        "start": 13474919,
        "end": 13511039
    }, {
        "filename": pL+"traceback.pyc",
        "start": 13511039,
        "end": 13556794
    }, {
        "filename": pL+"tracemalloc.pyc",
        "start": 13556794,
        "end": 13585956
    }, {
        "filename": pL+"tty.pyc",
        "start": 13585956,
        "end": 13588022
    }, {
        "filename": pL+"types.pyc",
        "start": 13588022,
        "end": 13602918
    }, {
        "filename": pL+"typing.pyc",
        "start": 13602918,
        "end": 13761848
    }, {
        "filename": pL+"urllib/__init__.pyc",
        "start": 13761848,
        "end": 13762036
    }, {
        "filename": pL+"urllib/error.pyc",
        "start": 13762036,
        "end": 13765898
    }, {
        "filename": pL+"urllib/parse.pyc",
        "start": 13765898,
        "end": 13819081
    }, {
        "filename": pL+"urllib/request.pyc",
        "start": 13819081,
        "end": 13946196
    }, {
        "filename": pL+"urllib/response.pyc",
        "start": 13946196,
        "end": 13951427
    }, {
        "filename": pL+"urllib/robotparser.pyc",
        "start": 13951427,
        "end": 13964915
    }, {
        "filename": pL+"urllib3/__init__.pyc",
        "start": 13964915,
        "end": 13968614
    }, {
        "filename": pL+"urllib3/_collections.pyc",
        "start": 13968614,
        "end": 13986618
    }, {
        "filename": pL+"urllib3/connection.pyc",
        "start": 13986618,
        "end": 14000997
    }, {
        "filename": pL+"urllib3/connectionpool.pyc",
        "start": 14000997,
        "end": 14036217
    }, {
        "filename": pL+"urllib3/contrib/__init__.pyc",
        "start": 14036217,
        "end": 14036428
    }, {
        "filename": pL+"urllib3/contrib/_securetransport/__init__.pyc",
        "start": 14036428,
        "end": 14036656
    }, {
        "filename": pL+"urllib3/contrib/_securetransport/bindings.pyc",
        "start": 14036656,
        "end": 14053116
    }, {
        "filename": pL+"urllib3/contrib/_securetransport/low_level.pyc",
        "start": 14053116,
        "end": 14066122
    }, {
        "filename": pL+"urllib3/contrib/appengine.pyc",
        "start": 14066122,
        "end": 14079329
    }, {
        "filename": pL+"urllib3/contrib/ntlmpool.pyc",
        "start": 14079329,
        "end": 14085271
    }, {
        "filename": pL+"urllib3/contrib/pyopenssl.pyc",
        "start": 14085271,
        "end": 14108367
    }, {
        "filename": pL+"urllib3/contrib/securetransport.pyc",
        "start": 14108367,
        "end": 14140393
    }, {
        "filename": pL+"urllib3/contrib/socks.pyc",
        "start": 14140393,
        "end": 14147643
    }, {
        "filename": pL+"urllib3/exceptions.pyc",
        "start": 14147643,
        "end": 14161365
    }, {
        "filename": pL+"urllib3/fields.pyc",
        "start": 14161365,
        "end": 14169491
    }, {
        "filename": pL+"urllib3/filepost.pyc",
        "start": 14169491,
        "end": 14173788
    }, {
        "filename": pL+"urllib3/packages/__init__.pyc",
        "start": 14173788,
        "end": 14174144
    }, {
        "filename": pL+"urllib3/packages/backports/__init__.pyc",
        "start": 14174144,
        "end": 14174366
    }, {
        "filename": pL+"urllib3/packages/backports/makefile.pyc",
        "start": 14174366,
        "end": 14176390
    }, {
        "filename": pL+"urllib3/packages/ordered_dict.pyc",
        "start": 14176390,
        "end": 14188895
    }, {
        "filename": pL+"urllib3/packages/six.pyc",
        "start": 14188895,
        "end": 14230235
    }, {
        "filename": pL+"urllib3/packages/ssl_match_hostname/__init__.pyc",
        "start": 14230235,
        "end": 14231059
    }, {
        "filename": pL+"urllib3/packages/ssl_match_hostname/_implementation.pyc",
        "start": 14231059,
        "end": 14236970
    }, {
        "filename": pL+"urllib3/poolmanager.pyc",
        "start": 14236970,
        "end": 14255232
    }, {
        "filename": pL+"urllib3/request.pyc",
        "start": 14255232,
        "end": 14261901
    }, {
        "filename": pL+"urllib3/response.pyc",
        "start": 14261901,
        "end": 14288613
    }, {
        "filename": pL+"urllib3/util/__init__.pyc",
        "start": 14288613,
        "end": 14289931
    }, {
        "filename": pL+"urllib3/util/connection.pyc",
        "start": 14289931,
        "end": 14294567
    }, {
        "filename": pL+"urllib3/util/request.pyc",
        "start": 14294567,
        "end": 14299076
    }, {
        "filename": pL+"urllib3/util/response.pyc",
        "start": 14299076,
        "end": 14301863
    }, {
        "filename": pL+"urllib3/util/retry.pyc",
        "start": 14301863,
        "end": 14318642
    }, {
        "filename": pL+"urllib3/util/selectors.pyc",
        "start": 14318642,
        "end": 14347590
    }, {
        "filename": pL+"urllib3/util/ssl_.pyc",
        "start": 14347590,
        "end": 14360160
    }, {
        "filename": pL+"urllib3/util/timeout.pyc",
        "start": 14360160,
        "end": 14371160
    }, {
        "filename": pL+"urllib3/util/url.pyc",
        "start": 14371160,
        "end": 14378622
    }, {
        "filename": pL+"urllib3/util/wait.pyc",
        "start": 14378622,
        "end": 14381124
    }, {
        "filename": pL+"uu.pyc",
        "start": 14381124,
        "end": 14389566
    }, {
        "filename": pL+"uuid.pyc",
        "start": 14389566,
        "end": 14422926
    }, {
        "filename": pL+"warnings.pyc",
        "start": 14422926,
        "end": 14448157
    }, {
        "filename": pL+"wave.pyc",
        "start": 14448157,
        "end": 14480632
    }, {
        "filename": pL+"weakref.pyc",
        "start": 14480632,
        "end": 14515748
    }, {
        "filename": pL+"webbrowser.pyc",
        "start": 14515748,
        "end": 14548649
    }, {
        "filename": pL+"xml/__init__.pyc",
        "start": 14548649,
        "end": 14549414
    }, {
        "filename": pL+"xml/dom/NodeFilter.pyc",
        "start": 14549414,
        "end": 14550602
    }, {
        "filename": pL+"xml/dom/__init__.pyc",
        "start": 14550602,
        "end": 14557777
    }, {
        "filename": pL+"xml/dom/domreg.pyc",
        "start": 14557777,
        "end": 14562077
    }, {
        "filename": pL+"xml/dom/expatbuilder.pyc",
        "start": 14562077,
        "end": 14608769
    }, {
        "filename": pL+"xml/dom/minicompat.pyc",
        "start": 14608769,
        "end": 14612733
    }, {
        "filename": pL+"xml/dom/minidom.pyc",
        "start": 14612733,
        "end": 14709237
    }, {
        "filename": pL+"xml/dom/pulldom.pyc",
        "start": 14709237,
        "end": 14727620
    }, {
        "filename": pL+"xml/dom/xmlbuilder.pyc",
        "start": 14727620,
        "end": 14745762
    }, {
        "filename": pL+"xml/etree/ElementInclude.pyc",
        "start": 14745762,
        "end": 14750479
    }, {
        "filename": pL+"xml/etree/ElementPath.pyc",
        "start": 14750479,
        "end": 14767886
    }, {
        "filename": pL+"xml/etree/ElementTree.pyc",
        "start": 14767886,
        "end": 14857288
    }, {
        "filename": pL+"xml/etree/__init__.pyc",
        "start": 14857288,
        "end": 14857479
    }, {
        "filename": pL+"xml/etree/cElementTree.pyc",
        "start": 14857479,
        "end": 14857722
    }, {
        "filename": pL+"xml/parsers/__init__.pyc",
        "start": 14857722,
        "end": 14858097
    }, {
        "filename": pL+"xml/parsers/expat.pyc",
        "start": 14858097,
        "end": 14858554
    }, {
        "filename": pL+"xml/sax/__init__.pyc",
        "start": 14858554,
        "end": 14863675
    }, {
        "filename": pL+"xml/sax/_exceptions.pyc",
        "start": 14863675,
        "end": 14870554
    }, {
        "filename": pL+"xml/sax/expatreader.pyc",
        "start": 14870554,
        "end": 14892506
    }, {
        "filename": pL+"xml/sax/handler.pyc",
        "start": 14892506,
        "end": 14908094
    }, {
        "filename": pL+"xml/sax/saxutils.pyc",
        "start": 14908094,
        "end": 14929725
    }, {
        "filename": pL+"xml/sax/xmlreader.pyc",
        "start": 14929725,
        "end": 14950718
    }, {
        "filename": pL+"zipapp.pyc",
        "start": 14950718,
        "end": 14962335
    }, {
        "filename": pL+"zipfile.pyc",
        "start": 14962335,
        "end": 15079962
    }, {
        "filename": pL+"zipimport.pyc",
        "start": 15079962,
        "end": 15109627
    }, {
        "filename": pL+"zoneinfo/__init__.pyc",
        "start": 15109627,
        "end": 15110896
    }, {
        "filename": pL+"zoneinfo/_common.pyc",
        "start": 15110896,
        "end": 15116859
    }, {
        "filename": pL+"zoneinfo/_tzpath.pyc",
        "start": 15116859,
        "end": 15124774
    }, {
        "filename": pL+"zoneinfo/_zoneinfo.pyc",
        "start": 15124774,
        "end": 15153274
    }]
    loadPackage({
        "files": files,
        "remote_package_size": 15153274
    })
})();
var moduleOverrides = Object.assign({}, Module);
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
    throw toThrow
};
var ENVIRONMENT_IS_WEB = typeof window == "object";
var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions
    .node == "string";
var scriptDirectory = "";

function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;

function logExceptionOnExit(e) {
    if (e instanceof ExitStatus) return;
    let toLog = e;
    err("exiting due to exception: " + toLog)
}
if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/"
    } else {
        scriptDirectory = __dirname + "/"
    }
    var fs, nodePath;
    if (typeof require === "function") {
        fs = require("fs");
        nodePath = require("path")
    }
    read_ = (filename, binary) => {
        filename = nodePath["normalize"](filename);
        return fs.readFileSync(filename, binary ? undefined : "utf8")
    };
    readBinary = filename => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        return ret
    };
    readAsync = (filename, onload, onerror) => {
        filename = nodePath["normalize"](filename);
        fs.readFile(filename, function (err, data) {
            if (err) onerror(err);
            else onload(data.buffer)
        })
    };
    if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/")
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module != "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    });
    process["on"]("unhandledRejection", function (reason) {
        throw reason
    });
    quit_ = (status, toThrow) => {
        if (keepRuntimeAlive()) {
            process["exitCode"] = status;
            throw toThrow
        }
        logExceptionOnExit(toThrow);
        process["exit"](status)
    };
    Module["inspect"] = function () {
        return "[Emscripten Module object]"
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    } {
        read_ = url => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText
        };
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
            }
        }
        readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    onload(xhr.response);
                    return
                }
                onerror()
            };
            xhr.onerror = onerror;
            xhr.send(null)
        }
    }
    setWindowTitle = title => document.title = title
} else {}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime = Module["noExitRuntime"] || true;
if (typeof WebAssembly != "object") {
    abort("no native wasm support detected")
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;

function assert(condition, text) {
    if (!condition) {
        abort(text)
    }
}
var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
    }
    var str = "";
    while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2
        } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
        }
        if (u0 < 65536) {
            str += String.fromCharCode(u0)
        } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
    }
    return str
}

function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}

function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
            len++
        } else if (c <= 2047) {
            len += 2
        } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i
        } else {
            len += 3
        }
    }
    return len
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 201326592;
var wasmTable;
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;

function keepRuntimeAlive() {
    return noExitRuntime
}

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    FS.ignorePermissions = false;
    TTY.init();
    SOCKFS.root = FS.mount(SOCKFS, {}, null);
    PIPEFS.root = FS.mount(PIPEFS, {}, null);
    callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}

function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}

function addOnInit(cb) {
    __ATINIT__.unshift(cb)
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
    return id
}

function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}

function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}

function abort(what) {
    {
        if (Module["onAbort"]) {
            Module["onAbort"](what)
        }
    }
    what = "Aborted(" + what + ")";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what += ". Build with -sASSERTIONS for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e
}
var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix)
}

function isFileURI(filename) {
    return filename.startsWith("file://")
}
var wasmBinaryFile;
wasmBinaryFile = "renpy.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}

function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(file)
        }
        throw "both async and sync fetching of the wasm failed"
    } catch (err) {
        abort(err)
    }
}

function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function (response) {
                if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                }
                return response["arrayBuffer"]()
            }).catch(function () {
                return getBinary(wasmBinaryFile)
            })
        } else {
            if (readAsync) {
                return new Promise(function (resolve, reject) {
                    readAsync(wasmBinaryFile, function (response) {
                        resolve(new Uint8Array(response))
                    }, reject)
                })
            }
        }
    }
    return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile)
    })
}

function createWasm() {
    var info = {
        "a": asmLibraryArg
    };

    function receiveInstance(instance, module) {
        var exports = instance.exports;
        exports = Asyncify.instrumentWasmExports(exports);
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["uh"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["Ah"];
        addOnInit(Module["asm"]["vh"]);
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");

    function receiveInstantiationResult(result) {
        receiveInstance(result["instance"])
    }

    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function (binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(function (instance) {
            return instance
        }).then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }

    function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !
            isFileURI(wasmBinaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function (response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiationResult, function (reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(receiveInstantiationResult)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiationResult)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            exports = Asyncify.instrumentWasmExports(exports);
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    instantiateAsync();
    return {}
}
var tempDouble;
var tempI64;
var ASM_CONSTS = {
    5153826: () => {
        if (typeof AudioContext !== "undefined") {
            return true
        } else if (typeof webkitAudioContext !== "undefined") {
            return true
        }
        return false
    },
    5153973: () => {
        if (typeof navigator.mediaDevices !== "undefined" && typeof navigator.mediaDevices.getUserMedia !==
            "undefined") {
            return true
        } else if (typeof navigator.webkitGetUserMedia !== "undefined") {
            return true
        }
        return false
    },
    5154207: $0 => {
        if (typeof Module["SDL2"] === "undefined") {
            Module["SDL2"] = {}
        }
        var SDL2 = Module["SDL2"];
        if (!$0) {
            SDL2.audio = {}
        } else {
            SDL2.capture = {}
        }
        if (!SDL2.audioContext) {
            if (typeof AudioContext !== "undefined") {
                SDL2.audioContext = new AudioContext
            } else if (typeof webkitAudioContext !== "undefined") {
                SDL2.audioContext = new webkitAudioContext
            }
            if (SDL2.audioContext) {
                autoResumeAudioContext(SDL2.audioContext)
            }
        }
        return SDL2.audioContext === undefined ? -1 : 0
    },
    5154700: () => {
        var SDL2 = Module["SDL2"];
        return SDL2.audioContext.sampleRate
    },
    5154768: ($0, $1, $2, $3) => {
        var SDL2 = Module["SDL2"];
        var have_microphone = function (stream) {
            if (SDL2.capture.silenceTimer !== undefined) {
                clearTimeout(SDL2.capture.silenceTimer);
                SDL2.capture.silenceTimer = undefined
            }
            SDL2.capture.mediaStreamNode = SDL2.audioContext.createMediaStreamSource(stream);
            SDL2.capture.scriptProcessorNode = SDL2.audioContext.createScriptProcessor($1, $0, 1);
            SDL2.capture.scriptProcessorNode.onaudioprocess = function (audioProcessingEvent) {
                if (SDL2 === undefined || SDL2.capture === undefined) {
                    return
                }
                audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
                SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer;
                dynCall("vi", $2, [$3])
            };
            SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode);
            SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination);
            SDL2.capture.stream = stream
        };
        var no_microphone = function (error) {};
        SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate);
        SDL2.capture.silenceBuffer.getChannelData(0).fill(0);
        var silence_callback = function () {
            SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer;
            dynCall("vi", $2, [$3])
        };
        SDL2.capture.silenceTimer = setTimeout(silence_callback, $1 / SDL2.audioContext.sampleRate * 1e3);
        if (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            }).then(have_microphone).catch(no_microphone)
        } else if (navigator.webkitGetUserMedia !== undefined) {
            navigator.webkitGetUserMedia({
                audio: true,
                video: false
            }, have_microphone, no_microphone)
        }
    },
    5156420: ($0, $1, $2, $3) => {
        var SDL2 = Module["SDL2"];
        SDL2.audio.scriptProcessorNode = SDL2.audioContext["createScriptProcessor"]($1, 0, $0);
        SDL2.audio.scriptProcessorNode["onaudioprocess"] = function (e) {
            if (SDL2 === undefined || SDL2.audio === undefined) {
                return
            }
            SDL2.audio.currentOutputBuffer = e["outputBuffer"];
            dynCall("vi", $2, [$3])
        };
        SDL2.audio.scriptProcessorNode["connect"](SDL2.audioContext["destination"])
    },
    5156830: ($0, $1) => {
        var SDL2 = Module["SDL2"];
        var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels;
        for (var c = 0; c < numChannels; ++c) {
            var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c);
            if (channelData.length != $1) {
                throw "Web Audio capture buffer length mismatch! Destination size: " + channelData.length +
                    " samples vs expected " + $1 + " samples!"
            }
            if (numChannels == 1) {
                for (var j = 0; j < $1; ++j) {
                    setValue($0 + j * 4, channelData[j], "float")
                }
            } else {
                for (var j = 0; j < $1; ++j) {
                    setValue($0 + (j * numChannels + c) * 4, channelData[j], "float")
                }
            }
        }
    },
    5157435: ($0, $1) => {
        var SDL2 = Module["SDL2"];
        var numChannels = SDL2.audio.currentOutputBuffer["numberOfChannels"];
        for (var c = 0; c < numChannels; ++c) {
            var channelData = SDL2.audio.currentOutputBuffer["getChannelData"](c);
            if (channelData.length != $1) {
                throw "Web Audio output buffer length mismatch! Destination size: " + channelData.length +
                    " samples vs expected " + $1 + " samples!"
            }
            for (var j = 0; j < $1; ++j) {
                channelData[j] = HEAPF32[$0 + (j * numChannels + c << 2) >> 2]
            }
        }
    },
    5157915: $0 => {
        var SDL2 = Module["SDL2"];
        if ($0) {
            if (SDL2.capture.silenceTimer !== undefined) {
                clearTimeout(SDL2.capture.silenceTimer)
            }
            if (SDL2.capture.stream !== undefined) {
                var tracks = SDL2.capture.stream.getAudioTracks();
                for (var i = 0; i < tracks.length; i++) {
                    SDL2.capture.stream.removeTrack(tracks[i])
                }
                SDL2.capture.stream = undefined
            }
            if (SDL2.capture.scriptProcessorNode !== undefined) {
                SDL2.capture.scriptProcessorNode.onaudioprocess = function (audioProcessingEvent) {};
                SDL2.capture.scriptProcessorNode.disconnect();
                SDL2.capture.scriptProcessorNode = undefined
            }
            if (SDL2.capture.mediaStreamNode !== undefined) {
                SDL2.capture.mediaStreamNode.disconnect();
                SDL2.capture.mediaStreamNode = undefined
            }
            if (SDL2.capture.silenceBuffer !== undefined) {
                SDL2.capture.silenceBuffer = undefined
            }
            SDL2.capture = undefined
        } else {
            if (SDL2.audio.scriptProcessorNode != undefined) {
                SDL2.audio.scriptProcessorNode.disconnect();
                SDL2.audio.scriptProcessorNode = undefined
            }
            SDL2.audio = undefined
        }
        if (SDL2.audioContext !== undefined && SDL2.audio === undefined && SDL2.capture === undefined) {
            SDL2.audioContext.close();
            SDL2.audioContext = undefined
        }
    },
    5159087: ($0, $1, $2, $3, $4) => {
        return Browser.safeSetTimeout(function () {
            dynCall("viiii", $0, [$1, $2, $3, $4])
        }, $2)
    },
    5159182: $0 => {
        window.clearTimeout($0)
    },
    5159211: ($0, $1, $2, $3, $4) => {
        return Browser.safeSetTimeout(function () {
            dynCall("viiii", $0, [$1, $2, $3, $4])
        }, $2)
    },
    5159306: ($0, $1, $2) => {
        var w = $0;
        var h = $1;
        var pixels = $2;
        if (!Module["SDL2"]) Module["SDL2"] = {};
        var SDL2 = Module["SDL2"];
        if (SDL2.ctxCanvas !== Module["canvas"]) {
            SDL2.ctx = Module["createContext"](Module["canvas"], false, true);
            SDL2.ctxCanvas = Module["canvas"]
        }
        if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) {
            SDL2.image = SDL2.ctx.createImageData(w, h);
            SDL2.w = w;
            SDL2.h = h;
            SDL2.imageCtx = SDL2.ctx
        }
        var data = SDL2.image.data;
        var src = pixels >> 2;
        var dst = 0;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = 255;
                src++;
                dst += 4
            }
        } else {
            if (SDL2.data32Data !== data) {
                SDL2.data32 = new Int32Array(data.buffer);
                SDL2.data8 = new Uint8Array(data.buffer);
                SDL2.data32Data = data
            }
            var data32 = SDL2.data32;
            num = data32.length;
            data32.set(HEAP32.subarray(src, src + num));
            var data8 = SDL2.data8;
            var i = 3;
            var j = i + 4 * num;
            if (num % 8 == 0) {
                while (i < j) {
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0
                }
            } else {
                while (i < j) {
                    data8[i] = 255;
                    i = i + 4 | 0
                }
            }
        }
        SDL2.ctx.putImageData(SDL2.image, 0, 0)
    },
    5160775: ($0, $1, $2, $3, $4) => {
        var w = $0;
        var h = $1;
        var hot_x = $2;
        var hot_y = $3;
        var pixels = $4;
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        var image = ctx.createImageData(w, h);
        var data = image.data;
        var src = pixels >> 2;
        var dst = 0;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = val >> 24 & 255;
                src++;
                dst += 4
            }
        } else {
            var data32 = new Int32Array(data.buffer);
            num = data32.length;
            data32.set(HEAP32.subarray(src, src + num))
        }
        ctx.putImageData(image, 0, 0);
        var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas
            .toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
        var urlBuf = _malloc(url.length + 1);
        stringToUTF8(url, urlBuf, url.length + 1);
        return urlBuf
    },
    5161764: $0 => {
        if (Module["canvas"]) {
            Module["canvas"].style["cursor"] = UTF8ToString($0)
        }
    },
    5161847: () => {
        if (Module["canvas"]) {
            Module["canvas"].style["cursor"] = "none"
        }
    },
    5161916: () => {
        return window.innerWidth
    },
    5161946: () => {
        return window.innerHeight
    }
};

function _Py_emscripten_runtime() {
    var info;
    if (typeof navigator == "object") {
        info = navigator.userAgent
    } else if (typeof process == "object") {
        info = "Node.js ".concat(process.version)
    } else {
        info = "UNKNOWN"
    }
    var len = lengthBytesUTF8(info) + 1;
    var res = _malloc(len);
    stringToUTF8(info, res, len);
    return res
}

function _Py_CheckEmscriptenSignals_Helper() {
    if (!Module.Py_EmscriptenSignalBuffer) {
        return 0
    }
    try {
        let result = Module.Py_EmscriptenSignalBuffer[0];
        Module.Py_EmscriptenSignalBuffer[0] = 0;
        return result
    } catch (e) {
        return 0
    }
}

function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}

function listenOnce(object, event, func) {
    object.addEventListener(event, func, {
        "once": true
    })
}

function autoResumeAudioContext(ctx, elements) {
    if (!elements) {
        elements = [document, document.getElementById("canvas")]
    } ["keydown", "mousedown", "touchstart"].forEach(function (event) {
        elements.forEach(function (element) {
            if (element) {
                listenOnce(element, event, () => {
                    if (ctx.state === "suspended") ctx.resume()
                })
            }
        })
    })
}

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        callbacks.shift()(Module)
    }
}

function dynCallLegacy(sig, ptr, args) {
    var f = Module["dynCall_" + sig];
    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr)
}

function dynCall(sig, ptr, args) {
    return dynCallLegacy(sig, ptr, args)
}

function setValue(ptr, value, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
        case "i1":
            HEAP8[ptr >> 0] = value;
            break;
        case "i8":
            HEAP8[ptr >> 0] = value;
            break;
        case "i16":
            HEAP16[ptr >> 1] = value;
            break;
        case "i32":
            HEAP32[ptr >> 2] = value;
            break;
        case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math
                    .floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~
                    tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] =
                tempI64[1];
            break;
        case "float":
            HEAPF32[ptr >> 2] = value;
            break;
        case "double":
            HEAPF64[ptr >> 3] = value;
            break;
        case "*":
            HEAPU32[ptr >> 2] = value;
            break;
        default:
            abort("invalid type for setValue: " + type)
    }
}

function ___assert_fail(condition, filename, line, func) {
    abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) :
        "unknown filename", line, func ? UTF8ToString(func) : "unknown function"
    ])
}

function ___call_sighandler(fp, sig) {
    (function (a1) {
        dynCall_vi.apply(null, [fp, a1])
    })(sig)
}
var PATH = {
    isAbs: path => path.charAt(0) === "/",
    splitPath: filename => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    },
    normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    },
    normalize: path => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    },
    dirname: path => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    },
    basename: path => {
        if (path === "/") return "/";
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1)
    },
    join: function () {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join("/"))
    },
    join2: (l, r) => {
        return PATH.normalize(l + "/" + r)
    }
};

function getRandomDevice() {
    if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
        var randomBuffer = new Uint8Array(1);
        return () => {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0]
        }
    } else if (ENVIRONMENT_IS_NODE) {
        try {
            var crypto_module = require("crypto");
            return () => crypto_module["randomBytes"](1)[0]
        } catch (e) {}
    }
    return () => abort("randomDevice")
}
var PATH_FS = {
    resolve: function () {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path)
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join(
            "/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    },
    relative: (from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    }
};

function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array
}
var TTY = {
    ttys: [],
    init: function () {},
    shutdown: function () {},
    register: function (dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    },
    stream_ops: {
        open: function (stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
        },
        close: function (stream) {
            stream.tty.ops.fsync(stream.tty)
        },
        fsync: function (stream) {
            stream.tty.ops.fsync(stream.tty)
        },
        read: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        },
        write: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        }
    },
    default_tty_ops: {
        get_char: function (tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc(BUFSIZE);
                    var bytesRead = 0;
                    try {
                        bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1)
                    } catch (e) {
                        if (e.toString().includes("EOF")) bytesRead = 0;
                        else throw e
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        },
        put_char: function (tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        fsync: function (tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    },
    default_tty1_ops: {
        put_char: function (tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        fsync: function (tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    }
};

function zeroMemory(address, size) {
    HEAPU8.fill(0, address, address + size);
    return address
}

function alignMemory(size, alignment) {
    return Math.ceil(size / alignment) * alignment
}

function mmapAlloc(size) {
    size = alignMemory(size, 65536);
    var ptr = _emscripten_builtin_memalign(65536, size);
    if (!ptr) return 0;
    return zeroMemory(ptr, size)
}
var MEMFS = {
    ops_table: null,
    mount: function (mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    },
    createNode: function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp
        }
        return node
    },
    getFileDataAsTypedArray: function (node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    },
    expandFileStorage: function (node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 :
            1.125) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
    },
    resizeFileStorage: function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0
        } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize
        }
    },
    node_ops: {
        getattr: function (node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        },
        setattr: function (node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        },
        lookup: function (parent, name) {
            throw FS.genericErrors[44]
        },
        mknod: function (parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function (old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir
        },
        unlink: function (parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now()
        },
        rmdir: function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55)
            }
            delete parent.contents[name];
            parent.timestamp = Date.now()
        },
        readdir: function (node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function (parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        },
        readlink: function (node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28)
            }
            return node.link
        }
    },
    stream_ops: {
        read: function (stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
            if (buffer.buffer === HEAP8.buffer) {
                canOwn = false
            }
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = buffer.slice(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position)
            } else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        },
        llseek: function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28)
            }
            return position
        },
        allocate: function (stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        },
        mmap: function (stream, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === buffer) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < contents.length) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48)
                }
                HEAP8.set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
            MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        }
    }
};

function asyncLoad(url, onload, onerror, noRunDep) {
    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
    readAsync(url, arrayBuffer => {
        assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep)
    }, event => {
        if (onerror) {
            onerror()
        } else {
            throw 'Loading data file "' + url + '" failed.'
        }
    });
    if (dep) addRunDependency(dep)
}
var IDBFS = {
    dbs: {},
    indexedDB: () => {
        if (typeof indexedDB != "undefined") return indexedDB;
        var ret = null;
        if (typeof window == "object") ret = window.indexedDB || window.mozIndexedDB || window
            .webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret
    },
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: function (mount) {
        return MEMFS.mount.apply(null, arguments)
    },
    syncfs: (mount, populate, callback) => {
        IDBFS.getLocalSet(mount, (err, local) => {
            if (err) return callback(err);
            IDBFS.getRemoteSet(mount, (err, remote) => {
                if (err) return callback(err);
                var src = populate ? remote : local;
                var dst = populate ? local : remote;
                IDBFS.reconcile(src, dst, callback)
            })
        })
    },
    quit: () => {
        Object.values(IDBFS.dbs).forEach(value => value.close());
        IDBFS.dbs = {}
    },
    getDB: (name, callback) => {
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db)
        }
        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
        } catch (e) {
            return callback(e)
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB")
        }
        req.onupgradeneeded = e => {
            var db = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
            }
            if (!fileStore.indexNames.contains("timestamp")) {
                fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                })
            }
        };
        req.onsuccess = () => {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db)
        };
        req.onerror = e => {
            callback(this.error);
            e.preventDefault()
        }
    },
    getLocalSet: (mount, callback) => {
        var entries = {};

        function isRealDir(p) {
            return p !== "." && p !== ".."
        }

        function toAbsolute(root) {
            return p => {
                return PATH.join2(root, p)
            }
        }
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
            var path = check.pop();
            var stat;
            try {
                stat = FS.stat(path)
            } catch (e) {
                return callback(e)
            }
            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
            }
            entries[path] = {
                "timestamp": stat.mtime
            }
        }
        return callback(null, {
            type: "local",
            entries: entries
        })
    },
    getRemoteSet: (mount, callback) => {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, (err, db) => {
            if (err) return callback(err);
            try {
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                transaction.onerror = e => {
                    callback(this.error);
                    e.preventDefault()
                };
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                var index = store.index("timestamp");
                index.openKeyCursor().onsuccess = event => {
                    var cursor = event.target.result;
                    if (!cursor) {
                        return callback(null, {
                            type: "remote",
                            db: db,
                            entries: entries
                        })
                    }
                    entries[cursor.primaryKey] = {
                        "timestamp": cursor.key
                    };
                    cursor.continue()
                }
            } catch (e) {
                return callback(e)
            }
        })
    },
    loadLocalEntry: (path, callback) => {
        var stat, node;
        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path)
        } catch (e) {
            return callback(e)
        }
        if (FS.isDir(stat.mode)) {
            return callback(null, {
                "timestamp": stat.mtime,
                "mode": stat.mode
            })
        } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, {
                "timestamp": stat.mtime,
                "mode": stat.mode,
                "contents": node.contents
            })
        } else {
            return callback(new Error("node type not supported"))
        }
    },
    storeLocalEntry: (path, entry, callback) => {
        try {
            if (FS.isDir(entry["mode"])) {
                FS.mkdirTree(path, entry["mode"])
            } else if (FS.isFile(entry["mode"])) {
                FS.writeFile(path, entry["contents"], {
                    canOwn: true
                })
            } else {
                return callback(new Error("node type not supported"))
            }
            FS.chmod(path, entry["mode"]);
            FS.utime(path, entry["timestamp"], entry["timestamp"])
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    removeLocalEntry: (path, callback) => {
        try {
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
                FS.rmdir(path)
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path)
            }
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    loadRemoteEntry: (store, path, callback) => {
        var req = store.get(path);
        req.onsuccess = event => {
            callback(null, event.target.result)
        };
        req.onerror = e => {
            callback(this.error);
            e.preventDefault()
        }
    },
    storeRemoteEntry: (store, path, entry, callback) => {
        try {
            var req = store.put(entry, path)
        } catch (e) {
            callback(e);
            return
        }
        req.onsuccess = () => {
            callback(null)
        };
        req.onerror = e => {
            callback(this.error);
            e.preventDefault()
        }
    },
    removeRemoteEntry: (store, path, callback) => {
        var req = store.delete(path);
        req.onsuccess = () => {
            callback(null)
        };
        req.onerror = e => {
            callback(this.error);
            e.preventDefault()
        }
    },
    reconcile: (src, dst, callback) => {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
                create.push(key);
                total++
            }
        });
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
            if (!src.entries[key]) {
                remove.push(key);
                total++
            }
        });
        if (!total) {
            return callback(null)
        }
        var errored = false;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

        function done(err) {
            if (err && !errored) {
                errored = true;
                return callback(err)
            }
        }
        transaction.onerror = e => {
            done(this.error);
            e.preventDefault()
        };
        transaction.oncomplete = e => {
            if (!errored) {
                callback(null)
            }
        };
        create.sort().forEach(path => {
            if (dst.type === "local") {
                IDBFS.loadRemoteEntry(store, path, (err, entry) => {
                    if (err) return done(err);
                    IDBFS.storeLocalEntry(path, entry, done)
                })
            } else {
                IDBFS.loadLocalEntry(path, (err, entry) => {
                    if (err) return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done)
                })
            }
        });
        remove.sort().reverse().forEach(path => {
            if (dst.type === "local") {
                IDBFS.removeLocalEntry(path, done)
            } else {
                IDBFS.removeRemoteEntry(store, path, done)
            }
        })
    }
};
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    lookupPath: (path, opts = {}) => {
        path = PATH_FS.resolve(FS.cwd(), path);
        if (!path) return {
            path: "",
            node: null
        };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        opts = Object.assign(defaults, opts);
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
        }
        var parts = PATH.normalizeArray(path.split("/").filter(p => !!p), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count + 1
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(32)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    },
    getPath: node => {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    },
    hashName: (parentid, name) => {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    },
    hashAddNode: node => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    },
    hashRemoveNode: node => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    },
    lookupNode: (parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
            throw new FS.ErrnoError(errCode, parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    },
    createNode: (parent, name, mode, rdev) => {
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node
    },
    destroyNode: node => {
        FS.hashRemoveNode(node)
    },
    isRoot: node => {
        return node === node.parent
    },
    isMountpoint: node => {
        return !!node.mounted
    },
    isFile: mode => {
        return (mode & 61440) === 32768
    },
    isDir: mode => {
        return (mode & 61440) === 16384
    },
    isLink: mode => {
        return (mode & 61440) === 40960
    },
    isChrdev: mode => {
        return (mode & 61440) === 8192
    },
    isBlkdev: mode => {
        return (mode & 61440) === 24576
    },
    isFIFO: mode => {
        return (mode & 61440) === 4096
    },
    isSocket: mode => {
        return (mode & 49152) === 49152
    },
    flagModes: {
        "r": 0,
        "r+": 2,
        "w": 577,
        "w+": 578,
        "a": 1089,
        "a+": 1090
    },
    modeStringToFlags: str => {
        var flags = FS.flagModes[str];
        if (typeof flags == "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    },
    flagsToPermissionString: flag => {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    },
    nodePermissions: (node, perms) => {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.includes("r") && !(node.mode & 292)) {
            return 2
        } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2
        } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2
        }
        return 0
    },
    mayLookup: dir => {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0
    },
    mayCreate: (dir, name) => {
        try {
            var node = FS.lookupNode(dir, name);
            return 20
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    },
    mayDelete: (dir, name, isdir) => {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
            return errCode
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31
            }
        }
        return 0
    },
    mayOpen: (node, flags) => {
        if (!node) {
            return 44
        }
        if (FS.isLink(node.mode)) {
            return 32
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    },
    MAX_OPEN_FDS: 4096,
    nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(33)
    },
    getStream: fd => FS.streams[fd],
    createStream: (stream, fd_start, fd_end) => {
        if (!FS.FSStream) {
            FS.FSStream = function () {
                this.shared = {}
            };
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: function () {
                        return this.node
                    },
                    set: function (val) {
                        this.node = val
                    }
                },
                isRead: {
                    get: function () {
                        return (this.flags & 2097155) !== 1
                    }
                },
                isWrite: {
                    get: function () {
                        return (this.flags & 2097155) !== 0
                    }
                },
                isAppend: {
                    get: function () {
                        return this.flags & 1024
                    }
                },
                flags: {
                    get: function () {
                        return this.shared.flags
                    },
                    set: function (val) {
                        this.shared.flags = val
                    }
                },
                position: {
                    get: function () {
                        return this.shared.position
                    },
                    set: function (val) {
                        this.shared.position = val
                    }
                }
            })
        }
        stream = Object.assign(new FS.FSStream, stream);
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    },
    closeStream: fd => {
        FS.streams[fd] = null
    },
    chrdev_stream_ops: {
        open: stream => {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        },
        llseek: () => {
            throw new FS.ErrnoError(70)
        }
    },
    major: dev => dev >> 8,
    minor: dev => dev & 255,
    makedev: (ma, mi) => ma << 8 | mi,
    registerDevice: (dev, ops) => {
        FS.devices[dev] = {
            stream_ops: ops
        }
    },
    getDevice: dev => FS.devices[dev],
    getMounts: mount => {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    },
    syncfs: (populate, callback) => {
        if (typeof populate == "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            err("warning: " + FS.syncFSRequests +
                " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode)
        }

        function done(errCode) {
            if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach(mount => {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        })
    },
    mount: (type, opts, mountpoint) => {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(10)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    },
    unmount: mountpoint => {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(hash => {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                    FS.destroyNode(current)
                }
                current = next
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1)
    },
    lookup: (parent, name) => {
        return parent.node_ops.lookup(parent, name)
    },
    mknod: (path, mode, dev) => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    },
    create: (path, mode) => {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    },
    mkdir: (path, mode) => {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    },
    mkdirTree: (path, mode) => {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != 20) throw e
            }
        }
    },
    mkdev: (path, mode, dev) => {
        if (typeof dev == "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    },
    symlink: (oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    },
    rename: (old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, {
            parent: true
        });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, {
            parent: true
        });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
        }
        if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
    },
    rmdir: path => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node)
    },
    readdir: path => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
        }
        return node.node_ops.readdir(node)
    },
    unlink: path => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node)
    },
    readlink: path => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    },
    stat: (path, dontFollow) => {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
        }
        return node.node_ops.getattr(node)
    },
    lstat: path => {
        return FS.stat(path, true)
    },
    chmod: (path, mode, dontFollow) => {
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    },
    lchmod: (path, mode) => {
        FS.chmod(path, mode, true)
    },
    fchmod: (fd, mode) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chmod(stream.node, mode)
    },
    chown: (path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    },
    lchown: (path, uid, gid) => {
        FS.chown(path, uid, gid, true)
    },
    fchown: (fd, uid, gid) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chown(stream.node, uid, gid)
    },
    truncate: (path, len) => {
        if (len < 0) {
            throw new FS.ErrnoError(28)
        }
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    },
    ftruncate: (fd, len) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
        }
        FS.truncate(stream.node, len)
    },
    utime: (path, atime, mtime) => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    },
    open: (path, flags, mode) => {
        if (path === "") {
            throw new FS.ErrnoError(44)
        }
        flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode == "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path == "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(20)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
        }
        if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        if (flags & 512 && !created) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        });
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1
            }
        }
        return stream
    },
    close: stream => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    },
    isClosed: stream => {
        return stream.fd === null
    },
    llseek: (stream, offset, whence) => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    },
    read: (stream, buffer, offset, length, position) => {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead
    },
    write: (stream, buffer, offset, length, position, canOwn) => {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
        }
        if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten
    },
    allocate: (stream, offset, length) => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
        }
        stream.stream_ops.allocate(stream, offset, length)
    },
    mmap: (stream, length, position, prot, flags) => {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags)
    },
    msync: (stream, buffer, offset, length, mmapFlags) => {
        if (!stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    },
    munmap: stream => 0,
    ioctl: (stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    },
    readFile: (path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    },
    writeFile: (path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    },
    cwd: () => FS.currentPath,
    chdir: path => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(44)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        FS.currentPath = lookup.path
    },
    createDefaultDirectories: () => {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    },
    createDefaultDevices: () => {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: () => 0,
            write: (stream, buffer, offset, length, pos) => length
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device = getRandomDevice();
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: () => {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: () => {
                var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: (parent, name) => {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream) throw new FS.ErrnoError(8);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: () => stream.path
                            }
                        };
                        ret.parent = ret;
                        return ret
                    }
                };
                return node
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: () => {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1)
    },
    ensureErrnoError: () => {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function (errno) {
                this.errno = errno
            };
            this.setErrno(errno);
            this.message = "FS error"
        };
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(code => {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        })
    },
    staticInit: () => {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS,
            "IDBFS": IDBFS
        }
    },
    init: (input, output, error) => {
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    },
    quit: () => {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    },
    getMode: (canRead, canWrite) => {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode
    },
    findObject: (path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
            return null
        }
        return ret.object
    },
    analyzePath: (path, dontResolveLastLink) => {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    },
    createPath: (parent, path, canRead, canWrite) => {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    },
    createFile: (parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    },
    createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent
        }
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    },
    createDevice: (parent, name, input, output) => {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: stream => {
                stream.seekable = false
            },
            close: stream => {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            },
            read: (stream, buffer, offset, length, pos) => {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6)
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            },
            write: (stream, buffer, offset, length, pos) => {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            }
        });
        return FS.mkdev(path, mode, dev)
    },
    forceLoadFile: obj => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != "undefined") {
            throw new Error(
                "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
                )
        } else if (read_) {
            try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
    },
    createLazyFile: (parent, name, url, canRead, canWrite) => {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error(
                "Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
                if (from > to) throw new Error("invalid range (" + from + ", " + to +
                    ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength +
                    " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error(
                    "Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                }
                return intArrayFromString(xhr.responseText || "", true)
            };
            var lazyArray = this;
            lazyArray.setDataGetter(chunkNum => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error(
                    "doXHR failed!");
                return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        };
        if (typeof XMLHttpRequest != "undefined") {
            if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    }
                },
                chunkSize: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    }
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function () {
                    return this.contents.length
                }
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(key => {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                FS.forceLoadFile(node);
                return fn.apply(null, arguments)
            }
        });

        function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position)
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc(length);
            if (!ptr) {
                throw new FS.ErrnoError(48)
            }
            writeChunks(stream, HEAP8, ptr, length, position);
            return {
                ptr: ptr,
                allocated: true
            }
        };
        node.stream_ops = stream_ops;
        return node
    },
    createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn,
        preFinish) => {
            var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
            var dep = getUniqueRunDependency("cp " + fullname);

            function processData(byteArray) {
                function finish(byteArray) {
                    if (preFinish) preFinish();
                    if (!dontCreateFile) {
                        FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                    }
                    if (onload) onload();
                    removeRunDependency(dep)
                }
                if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
                        if (onerror) onerror();
                        removeRunDependency(dep)
                    })) {
                    return
                }
                finish(byteArray)
            }
            addRunDependency(dep);
            if (typeof url == "string") {
                asyncLoad(url, byteArray => processData(byteArray), onerror)
            } else {
                processData(url)
            }
        },
    indexedDB: () => {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    },
    DB_NAME: () => {
        return "EM_FS_" + window.location.pathname
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: (paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = () => {
            out("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        };
        openRequest.onsuccess = () => {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach(path => {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = () => {
                    ok++;
                    if (ok + fail == total) finish()
                };
                putRequest.onerror = () => {
                    fail++;
                    if (ok + fail == total) finish()
                }
            });
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    },
    loadFilesFromDB: (paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = () => {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach(path => {
                var getRequest = files.get(path);
                getRequest.onsuccess = () => {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest
                        .result, true, true, true);
                    ok++;
                    if (ok + fail == total) finish()
                };
                getRequest.onerror = () => {
                    fail++;
                    if (ok + fail == total) finish()
                }
            });
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    }
};
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    calculateAt: function (dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
            return path
        }
        var dir;
        if (dirfd === -100) {
            dir = FS.cwd()
        } else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path
        }
        if (path.length == 0) {
            if (!allowEmpty) {
                throw new FS.ErrnoError(44)
            }
            return dir
        }
        return PATH.join2(dir, path)
    },
    doStat: function (func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -54
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAPU32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math
            .min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((
            tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[
            0], HEAP32[buf + 44 >> 2] = tempI64[1];
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        tempI64 = [Math.floor(stat.atime.getTime() / 1e3) >>> 0, (tempDouble = Math.floor(stat.atime.getTime() /
                1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble /
                4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>>
                0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] =
            tempI64[1];
        HEAPU32[buf + 64 >> 2] = 0;
        tempI64 = [Math.floor(stat.mtime.getTime() / 1e3) >>> 0, (tempDouble = Math.floor(stat.mtime.getTime() /
                1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble /
                4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>>
                0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] =
            tempI64[1];
        HEAPU32[buf + 80 >> 2] = 0;
        tempI64 = [Math.floor(stat.ctime.getTime() / 1e3) >>> 0, (tempDouble = Math.floor(stat.ctime.getTime() /
                1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble /
                4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>>
                0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] =
            tempI64[1];
        HEAPU32[buf + 96 >> 2] = 0;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math
            .min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((
            tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 104 >> 2] = tempI64[
            0], HEAP32[buf + 108 >> 2] = tempI64[1];
        return 0
    },
    doMsync: function (addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (flags & 2) {
            return 0
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags)
    },
    varargs: undefined,
    get: function () {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    },
    getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret
    },
    getStreamFromFD: function (fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream
    }
};

function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
    try {
        var total = 0;
        var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0,
            srcReadHigh = readfds ? HEAP32[readfds + 4 >> 2] : 0;
        var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0,
            srcWriteHigh = writefds ? HEAP32[writefds + 4 >> 2] : 0;
        var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0,
            srcExceptHigh = exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0;
        var dstReadLow = 0,
            dstReadHigh = 0;
        var dstWriteLow = 0,
            dstWriteHigh = 0;
        var dstExceptLow = 0,
            dstExceptHigh = 0;
        var allLow = (readfds ? HEAP32[readfds >> 2] : 0) | (writefds ? HEAP32[writefds >> 2] : 0) | (exceptfds ?
            HEAP32[exceptfds >> 2] : 0);
        var allHigh = (readfds ? HEAP32[readfds + 4 >> 2] : 0) | (writefds ? HEAP32[writefds + 4 >> 2] : 0) | (
            exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0);
        var check = function (fd, low, high, val) {
            return fd < 32 ? low & val : high & val
        };
        for (var fd = 0; fd < nfds; fd++) {
            var mask = 1 << fd % 32;
            if (!check(fd, allLow, allHigh, mask)) {
                continue
            }
            var stream = SYSCALLS.getStreamFromFD(fd);
            var flags = SYSCALLS.DEFAULT_POLLMASK;
            if (stream.stream_ops.poll) {
                flags = stream.stream_ops.poll(stream)
            }
            if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
                fd < 32 ? dstReadLow = dstReadLow | mask : dstReadHigh = dstReadHigh | mask;
                total++
            }
            if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
                fd < 32 ? dstWriteLow = dstWriteLow | mask : dstWriteHigh = dstWriteHigh | mask;
                total++
            }
            if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
                fd < 32 ? dstExceptLow = dstExceptLow | mask : dstExceptHigh = dstExceptHigh | mask;
                total++
            }
        }
        if (readfds) {
            HEAP32[readfds >> 2] = dstReadLow;
            HEAP32[readfds + 4 >> 2] = dstReadHigh
        }
        if (writefds) {
            HEAP32[writefds >> 2] = dstWriteLow;
            HEAP32[writefds + 4 >> 2] = dstWriteHigh
        }
        if (exceptfds) {
            HEAP32[exceptfds >> 2] = dstExceptLow;
            HEAP32[exceptfds + 4 >> 2] = dstExceptHigh
        }
        return total
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}
var SOCKFS = {
    mount: function (mount) {
        Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module[
            "websocket"] : {};
        Module["websocket"]._callbacks = {};
        Module["websocket"]["on"] = function (event, callback) {
            if ("function" === typeof callback) {
                this._callbacks[event] = callback
            }
            return this
        };
        Module["websocket"].emit = function (event, param) {
            if ("function" === typeof this._callbacks[event]) {
                this._callbacks[event].call(this, param)
            }
        };
        return FS.createNode(null, "/", 16384 | 511, 0)
    },
    createSocket: function (family, type, protocol) {
        type &= ~526336;
        var streaming = type == 1;
        if (streaming && protocol && protocol != 6) {
            throw new FS.ErrnoError(66)
        }
        var sock = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            error: null,
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
        };
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        var stream = FS.createStream({
            path: name,
            node: node,
            flags: 2,
            seekable: false,
            stream_ops: SOCKFS.stream_ops
        });
        sock.stream = stream;
        return sock
    },
    getSocket: function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
            return null
        }
        return stream.node.sock
    },
    stream_ops: {
        poll: function (stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock)
        },
        ioctl: function (stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs)
        },
        read: function (stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
                return 0
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length
        },
        write: function (stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length)
        },
        close: function (stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock)
        }
    },
    nextname: function () {
        if (!SOCKFS.nextname.current) {
            SOCKFS.nextname.current = 0
        }
        return "socket[" + SOCKFS.nextname.current++ + "]"
    },
    websocket_sock_ops: {
        createPeer: function (sock, addr, port) {
            var ws;
            if (typeof addr == "object") {
                ws = addr;
                addr = null;
                port = null
            }
            if (ws) {
                if (ws._socket) {
                    addr = ws._socket.remoteAddress;
                    port = ws._socket.remotePort
                } else {
                    var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                    if (!result) {
                        throw new Error("WebSocket URL must be in the format ws(s)://address:port")
                    }
                    addr = result[1];
                    port = parseInt(result[2], 10)
                }
            } else {
                try {
                    var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
                    var url = "ws:#".replace("#", "//");
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["url"]) {
                            url = Module["websocket"]["url"]
                        }
                    }
                    if (url === "ws://" || url === "wss://") {
                        var parts = addr.split("/");
                        url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/")
                    }
                    var subProtocols = "binary";
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["subprotocol"]) {
                            subProtocols = Module["websocket"]["subprotocol"]
                        }
                    }
                    var opts = undefined;
                    if (subProtocols !== "null") {
                        subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                        opts = subProtocols
                    }
                    if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
                        subProtocols = "null";
                        opts = undefined
                    }
                    var WebSocketConstructor;
                    if (ENVIRONMENT_IS_NODE) {
                        WebSocketConstructor = require("ws")
                    } else {
                        WebSocketConstructor = WebSocket
                    }
                    ws = new WebSocketConstructor(url, opts);
                    ws.binaryType = "arraybuffer"
                } catch (e) {
                    throw new FS.ErrnoError(23)
                }
            }
            var peer = {
                addr: addr,
                port: port,
                socket: ws,
                dgram_send_queue: []
            };
            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
            if (sock.type === 2 && typeof sock.sport != "undefined") {
                peer.dgram_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o"
                    .charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8,
                    sock.sport & 255
                ]))
            }
            return peer
        },
        getPeer: function (sock, addr, port) {
            return sock.peers[addr + ":" + port]
        },
        addPeer: function (sock, peer) {
            sock.peers[peer.addr + ":" + peer.port] = peer
        },
        removePeer: function (sock, peer) {
            delete sock.peers[peer.addr + ":" + peer.port]
        },
        handlePeerEvents: function (sock, peer) {
            var first = true;
            var handleOpen = function () {
                Module["websocket"].emit("open", sock.stream.fd);
                try {
                    var queued = peer.dgram_send_queue.shift();
                    while (queued) {
                        peer.socket.send(queued);
                        queued = peer.dgram_send_queue.shift()
                    }
                } catch (e) {
                    peer.socket.close()
                }
            };

            function handleMessage(data) {
                if (typeof data == "string") {
                    var encoder = new TextEncoder;
                    data = encoder.encode(data)
                } else {
                    assert(data.byteLength !== undefined);
                    if (data.byteLength == 0) {
                        return
                    }
                    data = new Uint8Array(data)
                }
                var wasfirst = first;
                first = false;
                if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 &&
                    data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[
                    6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                    var newport = data[8] << 8 | data[9];
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return
                }
                sock.recv_queue.push({
                    addr: peer.addr,
                    port: peer.port,
                    data: data
                });
                Module["websocket"].emit("message", sock.stream.fd)
            }
            if (ENVIRONMENT_IS_NODE) {
                peer.socket.on("open", handleOpen);
                peer.socket.on("message", function (data, isBinary) {
                    if (!isBinary) {
                        return
                    }
                    handleMessage(new Uint8Array(data).buffer)
                });
                peer.socket.on("close", function () {
                    Module["websocket"].emit("close", sock.stream.fd)
                });
                peer.socket.on("error", function (error) {
                    sock.error = 14;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error,
                        "ECONNREFUSED: Connection refused"
                    ])
                })
            } else {
                peer.socket.onopen = handleOpen;
                peer.socket.onclose = function () {
                    Module["websocket"].emit("close", sock.stream.fd)
                };
                peer.socket.onmessage = function peer_socket_onmessage(event) {
                    handleMessage(event.data)
                };
                peer.socket.onerror = function (error) {
                    sock.error = 14;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error,
                        "ECONNREFUSED: Connection refused"
                    ])
                }
            }
        },
        poll: function (sock) {
            if (sock.type === 1 && sock.server) {
                return sock.pending.length ? 64 | 1 : 0
            }
            var mask = 0;
            var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
            if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING ||
                dest && dest.socket.readyState === dest.socket.CLOSED) {
                mask |= 64 | 1
            }
            if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                mask |= 4
            }
            if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState ===
                dest.socket.CLOSED) {
                mask |= 16
            }
            return mask
        },
        ioctl: function (sock, request, arg) {
            switch (request) {
                case 21531:
                    var bytes = 0;
                    if (sock.recv_queue.length) {
                        bytes = sock.recv_queue[0].data.length
                    }
                    HEAP32[arg >> 2] = bytes;
                    return 0;
                default:
                    return 28
            }
        },
        close: function (sock) {
            if (sock.server) {
                try {
                    sock.server.close()
                } catch (e) {}
                sock.server = null
            }
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
                var peer = sock.peers[peers[i]];
                try {
                    peer.socket.close()
                } catch (e) {}
                SOCKFS.websocket_sock_ops.removePeer(sock, peer)
            }
            return 0
        },
        bind: function (sock, addr, port) {
            if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
                throw new FS.ErrnoError(28)
            }
            sock.saddr = addr;
            sock.sport = port;
            if (sock.type === 2) {
                if (sock.server) {
                    sock.server.close();
                    sock.server = null
                }
                try {
                    sock.sock_ops.listen(sock, 0)
                } catch (e) {
                    if (!(e instanceof FS.ErrnoError)) throw e;
                    if (e.errno !== 138) throw e
                }
            }
        },
        connect: function (sock, addr, port) {
            if (sock.server) {
                throw new FS.ErrnoError(138)
            }
            if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                if (dest) {
                    if (dest.socket.readyState === dest.socket.CONNECTING) {
                        throw new FS.ErrnoError(7)
                    } else {
                        throw new FS.ErrnoError(30)
                    }
                }
            }
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;
            throw new FS.ErrnoError(26)
        },
        listen: function (sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
                throw new FS.ErrnoError(138)
            }
            if (sock.server) {
                throw new FS.ErrnoError(28)
            }
            var WebSocketServer = require("ws").Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
                host: host,
                port: sock.sport
            });
            Module["websocket"].emit("listen", sock.stream.fd);
            sock.server.on("connection", function (ws) {
                if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;
                    sock.pending.push(newsock);
                    Module["websocket"].emit("connection", newsock.stream.fd)
                } else {
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    Module["websocket"].emit("connection", sock.stream.fd)
                }
            });
            sock.server.on("close", function () {
                Module["websocket"].emit("close", sock.stream.fd);
                sock.server = null
            });
            sock.server.on("error", function (error) {
                sock.error = 23;
                Module["websocket"].emit("error", [sock.stream.fd, sock.error,
                    "EHOSTUNREACH: Host is unreachable"
                ])
            })
        },
        accept: function (listensock) {
            if (!listensock.server || !listensock.pending.length) {
                throw new FS.ErrnoError(28)
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock
        },
        getname: function (sock, peer) {
            var addr, port;
            if (peer) {
                if (sock.daddr === undefined || sock.dport === undefined) {
                    throw new FS.ErrnoError(53)
                }
                addr = sock.daddr;
                port = sock.dport
            } else {
                addr = sock.saddr || 0;
                port = sock.sport || 0
            }
            return {
                addr: addr,
                port: port
            }
        },
        sendmsg: function (sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
                if (addr === undefined || port === undefined) {
                    addr = sock.daddr;
                    port = sock.dport
                }
                if (addr === undefined || port === undefined) {
                    throw new FS.ErrnoError(17)
                }
            } else {
                addr = sock.daddr;
                port = sock.dport
            }
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
            if (sock.type === 1) {
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest
                    .socket.CLOSED) {
                    throw new FS.ErrnoError(53)
                } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                    throw new FS.ErrnoError(6)
                }
            }
            if (ArrayBuffer.isView(buffer)) {
                offset += buffer.byteOffset;
                buffer = buffer.buffer
            }
            var data;
            data = buffer.slice(offset, offset + length);
            if (sock.type === 2) {
                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState ===
                        dest.socket.CLOSED) {
                        dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port)
                    }
                    dest.dgram_send_queue.push(data);
                    return length
                }
            }
            try {
                dest.socket.send(data);
                return length
            } catch (e) {
                throw new FS.ErrnoError(28)
            }
        },
        recvmsg: function (sock, length) {
            if (sock.type === 1 && sock.server) {
                throw new FS.ErrnoError(53)
            }
            var queued = sock.recv_queue.shift();
            if (!queued) {
                if (sock.type === 1) {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                    if (!dest) {
                        throw new FS.ErrnoError(53)
                    }
                    if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket
                        .CLOSED) {
                        return null
                    }
                    throw new FS.ErrnoError(6)
                }
                throw new FS.ErrnoError(6)
            }
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
                buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
                addr: queued.addr,
                port: queued.port
            };
            if (sock.type === 1 && bytesRead < queuedLength) {
                var bytesRemaining = queuedLength - bytesRead;
                queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                sock.recv_queue.unshift(queued)
            }
            return res
        }
    }
};

function getSocketFromFD(fd) {
    var socket = SOCKFS.getSocket(fd);
    if (!socket) throw new FS.ErrnoError(8);
    return socket
}

function setErrNo(value) {
    HEAP32[___errno_location() >> 2] = value;
    return value
}

function inetPton4(str) {
    var b = str.split(".");
    for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp)) return null;
        b[i] = tmp
    }
    return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0
}

function jstoi_q(str) {
    return parseInt(str)
}

function inetPton6(str) {
    var words;
    var w, offset, z;
    var valid6regx =
        /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
    var parts = [];
    if (!valid6regx.test(str)) {
        return null
    }
    if (str === "::") {
        return [0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (str.startsWith("::")) {
        str = str.replace("::", "Z:")
    } else {
        str = str.replace("::", ":Z:")
    }
    if (str.indexOf(".") > 0) {
        str = str.replace(new RegExp("[.]", "g"), ":");
        words = str.split(":");
        words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
        words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
        words = words.slice(0, words.length - 2)
    } else {
        words = str.split(":")
    }
    offset = 0;
    z = 0;
    for (w = 0; w < words.length; w++) {
        if (typeof words[w] == "string") {
            if (words[w] === "Z") {
                for (z = 0; z < 8 - words.length + 1; z++) {
                    parts[w + z] = 0
                }
                offset = z - 1
            } else {
                parts[w + offset] = _htons(parseInt(words[w], 16))
            }
        } else {
            parts[w + offset] = words[w]
        }
    }
    return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]]
}

function writeSockaddr(sa, family, addr, port, addrlen) {
    switch (family) {
        case 2:
            addr = inetPton4(addr);
            zeroMemory(sa, 16);
            if (addrlen) {
                HEAP32[addrlen >> 2] = 16
            }
            HEAP16[sa >> 1] = family;
            HEAP32[sa + 4 >> 2] = addr;
            HEAP16[sa + 2 >> 1] = _htons(port);
            break;
        case 10:
            addr = inetPton6(addr);
            zeroMemory(sa, 28);
            if (addrlen) {
                HEAP32[addrlen >> 2] = 28
            }
            HEAP32[sa >> 2] = family;
            HEAP32[sa + 8 >> 2] = addr[0];
            HEAP32[sa + 12 >> 2] = addr[1];
            HEAP32[sa + 16 >> 2] = addr[2];
            HEAP32[sa + 20 >> 2] = addr[3];
            HEAP16[sa + 2 >> 1] = _htons(port);
            break;
        default:
            return 5
    }
    return 0
}
var DNS = {
    address_map: {
        id: 1,
        addrs: {},
        names: {}
    },
    lookup_name: function (name) {
        var res = inetPton4(name);
        if (res !== null) {
            return name
        }
        res = inetPton6(name);
        if (res !== null) {
            return name
        }
        var addr;
        if (DNS.address_map.addrs[name]) {
            addr = DNS.address_map.addrs[name]
        } else {
            var id = DNS.address_map.id++;
            assert(id < 65535, "exceeded max address mappings of 65535");
            addr = "172.29." + (id & 255) + "." + (id & 65280);
            DNS.address_map.names[addr] = name;
            DNS.address_map.addrs[name] = addr
        }
        return addr
    },
    lookup_addr: function (addr) {
        if (DNS.address_map.names[addr]) {
            return DNS.address_map.names[addr]
        }
        return null
    }
};

function ___syscall_accept4(fd, addr, addrlen, flags) {
    try {
        var sock = getSocketFromFD(fd);
        var newsock = sock.sock_ops.accept(sock);
        if (addr) {
            var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen)
        }
        return newsock.stream.fd
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function inetNtop4(addr) {
    return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255)
}

function inetNtop6(ints) {
    var str = "";
    var word = 0;
    var longest = 0;
    var lastzero = 0;
    var zstart = 0;
    var len = 0;
    var i = 0;
    var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[
        3] & 65535, ints[3] >> 16
    ];
    var hasipv4 = true;
    var v4part = "";
    for (i = 0; i < 5; i++) {
        if (parts[i] !== 0) {
            hasipv4 = false;
            break
        }
    }
    if (hasipv4) {
        v4part = inetNtop4(parts[6] | parts[7] << 16);
        if (parts[5] === -1) {
            str = "::ffff:";
            str += v4part;
            return str
        }
        if (parts[5] === 0) {
            str = "::";
            if (v4part === "0.0.0.0") v4part = "";
            if (v4part === "0.0.0.1") v4part = "1";
            str += v4part;
            return str
        }
    }
    for (word = 0; word < 8; word++) {
        if (parts[word] === 0) {
            if (word - lastzero > 1) {
                len = 0
            }
            lastzero = word;
            len++
        }
        if (len > longest) {
            longest = len;
            zstart = word - longest + 1
        }
    }
    for (word = 0; word < 8; word++) {
        if (longest > 1) {
            if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                if (word === zstart) {
                    str += ":";
                    if (zstart === 0) str += ":"
                }
                continue
            }
        }
        str += Number(_ntohs(parts[word] & 65535)).toString(16);
        str += word < 7 ? ":" : ""
    }
    return str
}

function readSockaddr(sa, salen) {
    var family = HEAP16[sa >> 1];
    var port = _ntohs(HEAPU16[sa + 2 >> 1]);
    var addr;
    switch (family) {
        case 2:
            if (salen !== 16) {
                return {
                    errno: 28
                }
            }
            addr = HEAP32[sa + 4 >> 2];
            addr = inetNtop4(addr);
            break;
        case 10:
            if (salen !== 28) {
                return {
                    errno: 28
                }
            }
            addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
            addr = inetNtop6(addr);
            break;
        default:
            return {
                errno: 5
            }
    }
    return {
        family: family,
        addr: addr,
        port: port
    }
}

function getSocketAddress(addrp, addrlen, allowNull) {
    if (allowNull && addrp === 0) return null;
    var info = readSockaddr(addrp, addrlen);
    if (info.errno) throw new FS.ErrnoError(info.errno);
    info.addr = DNS.lookup_addr(info.addr) || info.addr;
    return info
}

function ___syscall_bind(fd, addr, addrlen) {
    try {
        var sock = getSocketFromFD(fd);
        var info = getSocketAddress(addr, addrlen);
        sock.sock_ops.bind(sock, info.addr, info.port);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_chdir(path) {
    try {
        path = SYSCALLS.getStr(path);
        FS.chdir(path);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_chmod(path, mode) {
    try {
        path = SYSCALLS.getStr(path);
        FS.chmod(path, mode);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_connect(fd, addr, addrlen) {
    try {
        var sock = getSocketFromFD(fd);
        var info = getSocketAddress(addr, addrlen);
        sock.sock_ops.connect(sock, info.addr, info.port);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_dup3(fd, suggestFD, flags) {
    try {
        var old = SYSCALLS.getStreamFromFD(fd);
        if (old.fd === suggestFD) return -28;
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.createStream(old, suggestFD, suggestFD + 1).fd
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_faccessat(dirfd, path, amode, flags) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (amode & ~7) {
            return -28
        }
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node) {
            return -44
        }
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -2
        }
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fadvise64(fd, offset, len, advice) {
    return 0
}

function ___syscall_fchdir(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.chdir(stream.path);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fchmod(fd, mode) {
    try {
        FS.fchmod(fd, mode);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fchmodat(dirfd, path, mode, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        FS.chmod(path, mode);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fchown32(fd, owner, group) {
    try {
        FS.fchown(fd, owner, group);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fchownat(dirfd, path, owner, group, flags) {
    try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        flags = flags & ~256;
        path = SYSCALLS.calculateAt(dirfd, path);
        (nofollow ? FS.lchown : FS.chown)(path, owner, group);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fcntl64(fd, cmd, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
            case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                    return -28
                }
                var newStream;
                newStream = FS.createStream(stream, arg);
                return newStream.fd
            }
            case 1:
            case 2:
                return 0;
            case 3:
                return stream.flags;
            case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0
            }
            case 5: {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0
            }
            case 6:
            case 7:
                return 0;
            case 16:
            case 8:
                return -28;
            case 9:
                setErrNo(28);
                return -1;
            default: {
                return -28
            }
        }
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fdatasync(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fstat64(fd, buf) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_statfs64(path, size, buf) {
    try {
        path = SYSCALLS.getStr(path);
        HEAP32[buf + 4 >> 2] = 4096;
        HEAP32[buf + 40 >> 2] = 4096;
        HEAP32[buf + 8 >> 2] = 1e6;
        HEAP32[buf + 12 >> 2] = 5e5;
        HEAP32[buf + 16 >> 2] = 5e5;
        HEAP32[buf + 20 >> 2] = FS.nextInode;
        HEAP32[buf + 24 >> 2] = 1e6;
        HEAP32[buf + 28 >> 2] = 42;
        HEAP32[buf + 44 >> 2] = 2;
        HEAP32[buf + 36 >> 2] = 255;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_fstatfs64(fd, size, buf) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return ___syscall_statfs64(0, size, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function convertI32PairToI53Checked(lo, hi) {
    return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN
}

function ___syscall_ftruncate64(fd, length_low, length_high) {
    try {
        var length = convertI32PairToI53Checked(length_low, length_high);
        if (isNaN(length)) return -61;
        FS.ftruncate(fd, length);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_getcwd(buf, size) {
    try {
        if (size === 0) return -28;
        var cwd = FS.cwd();
        var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
        if (size < cwdLengthInBytes) return -68;
        stringToUTF8(cwd, buf, size);
        return cwdLengthInBytes
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_getdents64(fd, dirp, count) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path)
        }
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var idx = Math.floor(off / struct_size);
        while (idx < stream.getdents.length && pos + struct_size <= count) {
            var id;
            var type;
            var name = stream.getdents[idx];
            if (name === ".") {
                id = stream.node.id;
                type = 4
            } else if (name === "..") {
                var lookup = FS.lookupPath(stream.path, {
                    parent: true
                });
                id = lookup.node.id;
                type = 4
            } else {
                var child = FS.lookupNode(stream.node, name);
                id = child.id;
                type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
            }
            tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(
                tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~
                tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >> 2] = tempI64[0], HEAP32[dirp +
                pos + 4 >> 2] = tempI64[1];
            tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >=
                1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~
                +Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >>
                2] = tempI64[0], HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
            HEAP16[dirp + pos + 16 >> 1] = 280;
            HEAP8[dirp + pos + 18 >> 0] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += struct_size;
            idx += 1
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_getpeername(fd, addr, addrlen) {
    try {
        var sock = getSocketFromFD(fd);
        if (!sock.daddr) {
            return -53
        }
        var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport, addrlen);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_getsockname(fd, addr, addrlen) {
    try {
        err("__syscall_getsockname " + fd);
        var sock = getSocketFromFD(fd);
        var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport, addrlen);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_getsockopt(fd, level, optname, optval, optlen) {
    try {
        var sock = getSocketFromFD(fd);
        if (level === 1) {
            if (optname === 4) {
                HEAP32[optval >> 2] = sock.error;
                HEAP32[optlen >> 2] = 4;
                sock.error = null;
                return 0
            }
        }
        return -50
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
            case 21509:
            case 21505: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0
            }
            case 21520: {
                if (!stream.tty) return -59;
                return -28
            }
            case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp)
            }
            case 21523: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21524: {
                if (!stream.tty) return -59;
                return 0
            }
            default:
                return -28
        }
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_listen(fd, backlog) {
    try {
        var sock = getSocketFromFD(fd);
        sock.sock_ops.listen(sock, backlog);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_lstat64(path, buf) {
    try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_mkdirat(dirfd, path, mode) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
    try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~4352;
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? SYSCALLS.get() : 0;
        return FS.open(path, flags, mode).fd
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}
var PIPEFS = {
    BUCKET_BUFFER_SIZE: 8192,
    mount: function (mount) {
        return FS.createNode(null, "/", 16384 | 511, 0)
    },
    createPipe: function () {
        var pipe = {
            buckets: [],
            refcnt: 2
        };
        pipe.buckets.push({
            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
            offset: 0,
            roffset: 0
        });
        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
        rNode.pipe = pipe;
        wNode.pipe = pipe;
        var readableStream = FS.createStream({
            path: rName,
            node: rNode,
            flags: 0,
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;
        var writableStream = FS.createStream({
            path: wName,
            node: wNode,
            flags: 1,
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;
        return {
            readable_fd: readableStream.fd,
            writable_fd: writableStream.fd
        }
    },
    stream_ops: {
        poll: function (stream) {
            var pipe = stream.node.pipe;
            if ((stream.flags & 2097155) === 1) {
                return 256 | 4
            }
            if (pipe.buckets.length > 0) {
                for (var i = 0; i < pipe.buckets.length; i++) {
                    var bucket = pipe.buckets[i];
                    if (bucket.offset - bucket.roffset > 0) {
                        return 64 | 1
                    }
                }
            }
            return 0
        },
        ioctl: function (stream, request, varargs) {
            return 28
        },
        fsync: function (stream) {
            return 28
        },
        read: function (stream, buffer, offset, length, position) {
            var pipe = stream.node.pipe;
            var currentLength = 0;
            for (var i = 0; i < pipe.buckets.length; i++) {
                var bucket = pipe.buckets[i];
                currentLength += bucket.offset - bucket.roffset
            }
            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);
            if (length <= 0) {
                return 0
            }
            if (currentLength == 0) {
                throw new FS.ErrnoError(6)
            }
            var toRead = Math.min(currentLength, length);
            var totalRead = toRead;
            var toRemove = 0;
            for (var i = 0; i < pipe.buckets.length; i++) {
                var currBucket = pipe.buckets[i];
                var bucketSize = currBucket.offset - currBucket.roffset;
                if (toRead <= bucketSize) {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    if (toRead < bucketSize) {
                        tmpSlice = tmpSlice.subarray(0, toRead);
                        currBucket.roffset += toRead
                    } else {
                        toRemove++
                    }
                    data.set(tmpSlice);
                    break
                } else {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    data.set(tmpSlice);
                    data = data.subarray(tmpSlice.byteLength);
                    toRead -= tmpSlice.byteLength;
                    toRemove++
                }
            }
            if (toRemove && toRemove == pipe.buckets.length) {
                toRemove--;
                pipe.buckets[toRemove].offset = 0;
                pipe.buckets[toRemove].roffset = 0
            }
            pipe.buckets.splice(0, toRemove);
            return totalRead
        },
        write: function (stream, buffer, offset, length, position) {
            var pipe = stream.node.pipe;
            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);
            var dataLen = data.byteLength;
            if (dataLen <= 0) {
                return 0
            }
            var currBucket = null;
            if (pipe.buckets.length == 0) {
                currBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: 0,
                    roffset: 0
                };
                pipe.buckets.push(currBucket)
            } else {
                currBucket = pipe.buckets[pipe.buckets.length - 1]
            }
            assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
            var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
            if (freeBytesInCurrBuffer >= dataLen) {
                currBucket.buffer.set(data, currBucket.offset);
                currBucket.offset += dataLen;
                return dataLen
            } else if (freeBytesInCurrBuffer > 0) {
                currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
                currBucket.offset += freeBytesInCurrBuffer;
                data = data.subarray(freeBytesInCurrBuffer, data.byteLength)
            }
            var numBuckets = data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0;
            var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
            for (var i = 0; i < numBuckets; i++) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: PIPEFS.BUCKET_BUFFER_SIZE,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
                data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength)
            }
            if (remElements > 0) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: data.byteLength,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data)
            }
            return dataLen
        },
        close: function (stream) {
            var pipe = stream.node.pipe;
            pipe.refcnt--;
            if (pipe.refcnt === 0) {
                pipe.buckets = null
            }
        }
    },
    nextname: function () {
        if (!PIPEFS.nextname.current) {
            PIPEFS.nextname.current = 0
        }
        return "pipe[" + PIPEFS.nextname.current++ + "]"
    }
};

function ___syscall_pipe(fdPtr) {
    try {
        if (fdPtr == 0) {
            throw new FS.ErrnoError(21)
        }
        var res = PIPEFS.createPipe();
        HEAP32[fdPtr >> 2] = res.readable_fd;
        HEAP32[fdPtr + 4 >> 2] = res.writable_fd;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_poll(fds, nfds, timeout) {
    try {
        var nonzero = 0;
        for (var i = 0; i < nfds; i++) {
            var pollfd = fds + 8 * i;
            var fd = HEAP32[pollfd >> 2];
            var events = HEAP16[pollfd + 4 >> 1];
            var mask = 32;
            var stream = FS.getStream(fd);
            if (stream) {
                mask = SYSCALLS.DEFAULT_POLLMASK;
                if (stream.stream_ops.poll) {
                    mask = stream.stream_ops.poll(stream)
                }
            }
            mask &= events | 8 | 16;
            if (mask) nonzero++;
            HEAP16[pollfd + 6 >> 1] = mask
        }
        return nonzero
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
    try {
        var sock = getSocketFromFD(fd);
        var msg = sock.sock_ops.recvmsg(sock, len);
        if (!msg) return 0;
        if (addr) {
            var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen)
        }
        HEAPU8.set(msg.buffer, buf);
        return msg.buffer.byteLength
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_recvmsg(fd, message, flags) {
    try {
        var sock = getSocketFromFD(fd);
        var iov = HEAPU32[message + 8 >> 2];
        var num = HEAP32[message + 12 >> 2];
        var total = 0;
        for (var i = 0; i < num; i++) {
            total += HEAP32[iov + (8 * i + 4) >> 2]
        }
        var msg = sock.sock_ops.recvmsg(sock, total);
        if (!msg) return 0;
        var name = HEAPU32[message >> 2];
        if (name) {
            var errno = writeSockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port)
        }
        var bytesRead = 0;
        var bytesRemaining = msg.buffer.byteLength;
        for (var i = 0; bytesRemaining > 0 && i < num; i++) {
            var iovbase = HEAPU32[iov + (8 * i + 0) >> 2];
            var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
            if (!iovlen) {
                continue
            }
            var length = Math.min(iovlen, bytesRemaining);
            var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
            HEAPU8.set(buf, iovbase + bytesRead);
            bytesRead += length;
            bytesRemaining -= length
        }
        return bytesRead
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
    try {
        oldpath = SYSCALLS.getStr(oldpath);
        newpath = SYSCALLS.getStr(newpath);
        oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
        newpath = SYSCALLS.calculateAt(newdirfd, newpath);
        FS.rename(oldpath, newpath);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_rmdir(path) {
    try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_sendmsg(fd, message, flags) {
    try {
        var sock = getSocketFromFD(fd);
        var iov = HEAPU32[message + 8 >> 2];
        var num = HEAP32[message + 12 >> 2];
        var addr, port;
        var name = HEAPU32[message >> 2];
        var namelen = HEAP32[message + 4 >> 2];
        if (name) {
            var info = readSockaddr(name, namelen);
            if (info.errno) return -info.errno;
            port = info.port;
            addr = DNS.lookup_addr(info.addr) || info.addr
        }
        var total = 0;
        for (var i = 0; i < num; i++) {
            total += HEAP32[iov + (8 * i + 4) >> 2]
        }
        var view = new Uint8Array(total);
        var offset = 0;
        for (var i = 0; i < num; i++) {
            var iovbase = HEAPU32[iov + (8 * i + 0) >> 2];
            var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
            for (var j = 0; j < iovlen; j++) {
                view[offset++] = HEAP8[iovbase + j >> 0]
            }
        }
        return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
    try {
        var sock = getSocketFromFD(fd);
        var dest = getSocketAddress(addr, addr_len, true);
        if (!dest) {
            return FS.write(sock.stream, HEAP8, message, length)
        }
        return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_socket(domain, type, protocol) {
    try {
        var sock = SOCKFS.createSocket(domain, type, protocol);
        return sock.stream.fd
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_stat64(path, buf) {
    try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_symlink(target, linkpath) {
    try {
        target = SYSCALLS.getStr(target);
        linkpath = SYSCALLS.getStr(linkpath);
        FS.symlink(target, linkpath);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_truncate64(path, length_low, length_high) {
    try {
        var length = convertI32PairToI53Checked(length_low, length_high);
        if (isNaN(length)) return -61;
        path = SYSCALLS.getStr(path);
        FS.truncate(path, length);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function ___syscall_unlinkat(dirfd, path, flags) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (flags === 0) {
            FS.unlink(path)
        } else if (flags === 512) {
            FS.rmdir(path)
        } else {
            abort("Invalid flags passed to unlinkat")
        }
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function readI53FromI64(ptr) {
    return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296
}

function ___syscall_utimensat(dirfd, path, times, flags) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path, true);
        if (!times) {
            var atime = Date.now();
            var mtime = atime
        } else {
            var seconds = readI53FromI64(times);
            var nanoseconds = HEAP32[times + 8 >> 2];
            atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
            times += 16;
            seconds = readI53FromI64(times);
            nanoseconds = HEAP32[times + 8 >> 2];
            mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3)
        }
        FS.utime(path, atime, mtime);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function __dlinit(main_dso_handle) {}
var dlopenMissingError =
    "To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking";

function __dlopen_js(filename, flag) {
    abort(dlopenMissingError)
}

function __dlsym_js(handle, symbol) {
    abort(dlopenMissingError)
}
var nowIsMonotonic = true;

function __emscripten_get_now_is_monotonic() {
    return nowIsMonotonic
}

function __emscripten_throw_longjmp() {
    throw Infinity
}

function __gmtime_js(time, tmPtr) {
    var date = new Date(readI53FromI64(time) * 1e3);
    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
    HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
    HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday
}

function __localtime_js(time, tmPtr) {
    var date = new Date(readI53FromI64(time) * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var start = new Date(date.getFullYear(), 0, 1);
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst
}

function __mktime_js(tmPtr) {
    var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr +
        8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
    var dst = HEAP32[tmPtr + 32 >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    if (dst < 0) {
        HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset)
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
    }
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getYear();
    return date.getTime() / 1e3 | 0
}

function __mmap_js(len, prot, flags, fd, off, allocated, addr) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var res = FS.mmap(stream, len, off, prot, flags);
        var ptr = res.ptr;
        HEAP32[allocated >> 2] = res.allocated;
        HEAPU32[addr >> 2] = ptr;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function __msync_js(addr, len, prot, flags, fd, offset) {
    try {
        SYSCALLS.doMsync(addr, SYSCALLS.getStreamFromFD(fd), len, flags, 0);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function __munmap_js(addr, len, prot, flags, fd, offset) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (prot & 2) {
            SYSCALLS.doMsync(addr, stream, len, flags, offset)
        }
        FS.munmap(stream)
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno
    }
}

function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function _tzset_impl(timezone, daylight, tzname) {
    var currentYear = (new Date).getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
    HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);

    function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT"
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocateUTF8(winterName);
    var summerNamePtr = allocateUTF8(summerName);
    if (summerOffset < winterOffset) {
        HEAPU32[tzname >> 2] = winterNamePtr;
        HEAPU32[tzname + 4 >> 2] = summerNamePtr
    } else {
        HEAPU32[tzname >> 2] = summerNamePtr;
        HEAPU32[tzname + 4 >> 2] = winterNamePtr
    }
}

function __tzset_js(timezone, daylight, tzname) {
    if (__tzset_js.called) return;
    __tzset_js.called = true;
    _tzset_impl(timezone, daylight, tzname)
}

function _abort() {
    abort("")
}

function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        return 1
    }
    if (!Browser.mainLoop.running) {
        Browser.mainLoop.running = true
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        };
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (typeof setImmediate == "undefined") {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";
            var Browser_setImmediate_messageHandler = event => {
                if (event.data === emscriptenMainLoopMessageId || event.data.target ===
                    emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "immediate"
    }
    return 0
}
var _emscripten_get_now;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = () => {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else _emscripten_get_now = () => performance.now();

function _proc_exit(code) {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
        if (Module["onExit"]) Module["onExit"](code);
        ABORT = true
    }
    quit_(code, new ExitStatus(code))
}

function exitJS(status, implicit) {
    EXITSTATUS = status;
    _proc_exit(status)
}
var _exit = exitJS;

function handleException(e) {
    if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS
    }
    quit_(1, e)
}

function maybeExit() {}

function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
    assert(!Browser.mainLoop.func,
        "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
        );
    Browser.mainLoop.func = browserIterationFunc;
    Browser.mainLoop.arg = arg;
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;

    function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
            maybeExit();
            return false
        }
        return true
    }
    Browser.mainLoop.running = false;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            out('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (!checkIsRunning()) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (!checkIsRunning()) return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop
            .currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        GL.newRenderingFrameStarted();
        Browser.mainLoop.runIter(browserIterationFunc);
        if (!checkIsRunning()) return;
        if (typeof SDL == "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    };
    if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "unwind"
    }
}

function callUserCallback(func) {
    if (ABORT) {
        return
    }
    try {
        func()
    } catch (e) {
        handleException(e)
    }
}

function safeSetTimeout(func, timeout) {
    return setTimeout(function () {
        callUserCallback(func)
    }, timeout)
}

function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
        err(text)
    }
}
var Browser = {
    mainLoop: {
        running: false,
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function () {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        },
        resume: function () {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        },
        updateStatus: function () {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        },
        runIter: function (func) {
            if (ABORT) return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            callUserCallback(func);
            if (Module["postMainLoop"]) Module["postMainLoop"]()
        }
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        if (Browser.initted) return;
        Browser.initted = true;
        try {
            new Blob;
            Browser.hasBlobConstructor = true
        } catch (e) {
            Browser.hasBlobConstructor = false;
            err("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder :
            typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? err(
                "warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL :
            undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject == "undefined") {
            err(
            "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    });
                    if (b.size !== byteArray.length) {
                        b = new Blob([new Uint8Array(byteArray).buffer], {
                            type: Browser.getMimetype(name)
                        })
                    }
                } catch (e) {
                    warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                }
            }
            if (!b) {
                var bb = new Browser.BlobBuilder;
                bb.append(new Uint8Array(byteArray).buffer);
                b = bb.getBlob()
            }
            var url = Browser.URLObject.createObjectURL(b);
            var img = new Image;
            img.onload = () => {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                preloadedImages[name] = canvas;
                Browser.URLObject.revokeObjectURL(url);
                if (onload) onload(byteArray)
            };
            img.onerror = event => {
                out("Image " + url + " could not be decoded");
                if (onerror) onerror()
            };
            img.src = url
        };
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;

            function finish(audio) {
                if (done) return;
                done = true;
                preloadedAudios[name] = audio;
                if (onload) onload(byteArray)
            }

            function fail() {
                if (done) return;
                done = true;
                preloadedAudios[name] = new Audio;
                if (onerror) onerror()
            }
            if (Browser.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    })
                } catch (e) {
                    return fail()
                }
                var url = Browser.URLObject.createObjectURL(b);
                var audio = new Audio;
                audio.addEventListener("canplaythrough", () => finish(audio), false);
                audio.onerror = function audio_onerror(event) {
                    if (done) return;
                    err("warning: browser could not fully decode audio " + name +
                        ", trying slower base64 approach");

                    function encode64(data) {
                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var PAD = "=";
                        var ret = "";
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = leftchar << 8 | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = leftchar >> leftbits - 6 & 63;
                                leftbits -= 6;
                                ret += BASE[curr]
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 15) << 2];
                            ret += PAD
                        }
                        return ret
                    }
                    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                    finish(audio)
                };
                audio.src = url;
                safeSetTimeout(function () {
                    finish(audio)
                }, 1e4)
            } else {
                return fail()
            }
        };
        Module["preloadPlugins"].push(audioPlugin);

        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document[
                    "mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] ===
                Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] ||
                canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (() => {});
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document[
                "webkitExitPointerLock"] || document["msExitPointerLock"] || (() => {});
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", ev => {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }, false)
            }
        }
    },
    handledByPreloadPlugin: function (byteArray, fullname, finish, onerror) {
        Browser.init();
        var handled = false;
        Module["preloadPlugins"].forEach(function (plugin) {
            if (handled) return;
            if (plugin["canHandle"](fullname)) {
                plugin["handle"](byteArray, fullname, finish, onerror);
                handled = true
            }
        });
        return handled
    },
    createContext: function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: typeof WebGL2RenderingContext != "undefined" ? 2 : 1
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            if (typeof GL != "undefined") {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                    ctx = GL.getContext(contextHandle).GLctx
                }
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx) return null;
        if (setInModule) {
            if (!useWebGL) assert(typeof GLctx == "undefined",
                "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
                callback()
            });
            Browser.init()
        }
        return ctx
    },
    destroyContext: function (canvas, useWebGL, setInModule) {},
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
        var canvas = Module["canvas"];

        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document[
                    "msFullscreenElement"] || document["webkitFullscreenElement"] || document[
                    "webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            }
            if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer[
            "mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer[
            "webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element[
            "ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () =>
            canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
        canvasContainer.requestFullscreen()
    },
    exitFullscreen: function () {
        if (!Browser.isFullscreen) {
            return false
        }
        var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document[
            "mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] ||
            function () {};
        CFS.apply(document, []);
        return true
    },
    nextRAF: 0,
    fakeRequestAnimationFrame: function (func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    },
    requestAnimationFrame: function (func) {
        if (typeof requestAnimationFrame == "function") {
            requestAnimationFrame(func);
            return
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func)
    },
    safeSetTimeout: function (func, timeout) {
        return safeSetTimeout(func, timeout)
    },
    safeRequestAnimationFrame: function (func) {
        return Browser.requestAnimationFrame(function () {
            callUserCallback(func)
        })
    },
    getMimetype: function (name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        } [name.substr(name.lastIndexOf(".") + 1)]
    },
    getUserMedia: function (func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    },
    getMovementX: function (event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    },
    getMovementY: function (event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    },
    getMouseWheelDelta: function (event) {
        var delta = 0;
        switch (event.type) {
            case "DOMMouseScroll":
                delta = event.detail / 3;
                break;
            case "mousewheel":
                delta = event.wheelDelta / 120;
                break;
            case "wheel":
                delta = event.deltaY;
                switch (event.deltaMode) {
                    case 0:
                        delta /= 100;
                        break;
                    case 1:
                        delta /= 3;
                        break;
                    case 2:
                        delta *= 80;
                        break;
                    default:
                        throw "unrecognized mouse wheel delta mode: " + event.deltaMode
                }
                break;
            default:
                throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    },
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: function (event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last) last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    },
    resizeListeners: [],
    updateResizeListeners: function () {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach(function (listener) {
            listener(canvas.width, canvas.height)
        })
    },
    setCanvasSize: function (width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners()
    },
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: function () {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    setWindowedCanvasSize: function () {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    updateCanvasDimensions: function (canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document[
                "msFullscreenElement"] || document["webkitFullscreenElement"] || document[
                "webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w) canvas.width = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative) canvas.width = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    }
};
var EGL = {
    errorCode: 12288,
    defaultDisplayInitialized: false,
    currentContext: 0,
    currentReadSurface: 0,
    currentDrawSurface: 0,
    contextAttributes: {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false
    },
    stringCache: {},
    setErrorCode: function (code) {
        EGL.errorCode = code
    },
    chooseConfig: function (display, attribList, config, config_size, numConfigs) {
        if (display != 62e3) {
            EGL.setErrorCode(12296);
            return 0
        }
        if (attribList) {
            for (;;) {
                var param = HEAP32[attribList >> 2];
                if (param == 12321) {
                    var alphaSize = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.alpha = alphaSize > 0
                } else if (param == 12325) {
                    var depthSize = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.depth = depthSize > 0
                } else if (param == 12326) {
                    var stencilSize = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.stencil = stencilSize > 0
                } else if (param == 12337) {
                    var samples = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.antialias = samples > 0
                } else if (param == 12338) {
                    var samples = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.antialias = samples == 1
                } else if (param == 12544) {
                    var requestedPriority = HEAP32[attribList + 4 >> 2];
                    EGL.contextAttributes.lowLatency = requestedPriority != 12547
                } else if (param == 12344) {
                    break
                }
                attribList += 8
            }
        }
        if ((!config || !config_size) && !numConfigs) {
            EGL.setErrorCode(12300);
            return 0
        }
        if (numConfigs) {
            HEAP32[numConfigs >> 2] = 1
        }
        if (config && config_size > 0) {
            HEAP32[config >> 2] = 62002
        }
        EGL.setErrorCode(12288);
        return 1
    }
};

function _eglBindAPI(api) {
    if (api == 12448) {
        EGL.setErrorCode(12288);
        return 1
    }
    EGL.setErrorCode(12300);
    return 0
}

function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
    return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs)
}

function __webgl_enable_ANGLE_instanced_arrays(ctx) {
    var ext = ctx.getExtension("ANGLE_instanced_arrays");
    if (ext) {
        ctx["vertexAttribDivisor"] = function (index, divisor) {
            ext["vertexAttribDivisorANGLE"](index, divisor)
        };
        ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
            ext["drawArraysInstancedANGLE"](mode, first, count, primcount)
        };
        ctx["drawElementsInstanced"] = function (mode, count, type, indices, primcount) {
            ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
        };
        return 1
    }
}

function __webgl_enable_OES_vertex_array_object(ctx) {
    var ext = ctx.getExtension("OES_vertex_array_object");
    if (ext) {
        ctx["createVertexArray"] = function () {
            return ext["createVertexArrayOES"]()
        };
        ctx["deleteVertexArray"] = function (vao) {
            ext["deleteVertexArrayOES"](vao)
        };
        ctx["bindVertexArray"] = function (vao) {
            ext["bindVertexArrayOES"](vao)
        };
        ctx["isVertexArray"] = function (vao) {
            return ext["isVertexArrayOES"](vao)
        };
        return 1
    }
}

function __webgl_enable_WEBGL_draw_buffers(ctx) {
    var ext = ctx.getExtension("WEBGL_draw_buffers");
    if (ext) {
        ctx["drawBuffers"] = function (n, bufs) {
            ext["drawBuffersWEBGL"](n, bufs)
        };
        return 1
    }
}

function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"))
}

function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"))
}

function __webgl_enable_WEBGL_multi_draw(ctx) {
    return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"))
}
var GL = {
    counter: 1,
    buffers: [],
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    shaders: [],
    vaos: [],
    contexts: [],
    offscreenCanvases: {},
    queries: [],
    samplers: [],
    transformFeedbacks: [],
    syncs: [],
    byteSizeByTypeRoot: 5120,
    byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    stringCache: {},
    stringiCache: {},
    unpackAlignment: 4,
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    },
    MAX_TEMP_BUFFER_SIZE: 2097152,
    numTempVertexBuffersPerSize: 64,
    log2ceilLookup: function (i) {
        return 32 - Math.clz32(i === 0 ? 0 : i - 1)
    },
    generateTempBuffers: function (quads, context) {
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        context.tempVertexBufferCounters1 = [];
        context.tempVertexBufferCounters2 = [];
        context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
        context.tempVertexBuffers1 = [];
        context.tempVertexBuffers2 = [];
        context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
        context.tempIndexBuffers = [];
        context.tempIndexBuffers.length = largestIndex + 1;
        for (var i = 0; i <= largestIndex; ++i) {
            context.tempIndexBuffers[i] = null;
            context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
            var ringbufferLength = GL.numTempVertexBuffersPerSize;
            context.tempVertexBuffers1[i] = [];
            context.tempVertexBuffers2[i] = [];
            var ringbuffer1 = context.tempVertexBuffers1[i];
            var ringbuffer2 = context.tempVertexBuffers2[i];
            ringbuffer1.length = ringbuffer2.length = ringbufferLength;
            for (var j = 0; j < ringbufferLength; ++j) {
                ringbuffer1[j] = ringbuffer2[j] = null
            }
        }
        if (quads) {
            context.tempQuadIndexBuffer = GLctx.createBuffer();
            context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
            var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
            var quadIndexes = new Uint16Array(numIndexes);
            var i = 0,
                v = 0;
            while (1) {
                quadIndexes[i++] = v;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 1;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 2;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 2;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 3;
                if (i >= numIndexes) break;
                v += 4
            }
            context.GLctx.bufferData(34963, quadIndexes, 35044);
            context.GLctx.bindBuffer(34963, null)
        }
    },
    getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
        GL.currentContext.tempVertexBufferCounters1[idx] = GL.currentContext.tempVertexBufferCounters1[idx] +
            1 & GL.numTempVertexBuffersPerSize - 1;
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
            return vbo
        }
        var prevVBO = GLctx.getParameter(34964);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(34962, 1 << idx, 35048);
        GLctx.bindBuffer(34962, prevVBO);
        return ringbuffer[nextFreeBufferIndex]
    },
    getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ibo = GL.currentContext.tempIndexBuffers[idx];
        if (ibo) {
            return ibo
        }
        var prevIBO = GLctx.getParameter(34965);
        GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
        GLctx.bufferData(34963, 1 << idx, 35048);
        GLctx.bindBuffer(34963, prevIBO);
        return GL.currentContext.tempIndexBuffers[idx]
    },
    newRenderingFrameStarted: function newRenderingFrameStarted() {
        if (!GL.currentContext) {
            return
        }
        var vb = GL.currentContext.tempVertexBuffers1;
        GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
        GL.currentContext.tempVertexBuffers2 = vb;
        vb = GL.currentContext.tempVertexBufferCounters1;
        GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
        GL.currentContext.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        for (var i = 0; i <= largestIndex; ++i) {
            GL.currentContext.tempVertexBufferCounters1[i] = 0
        }
    },
    getSource: function (shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var len = length ? HEAP32[length + i * 4 >> 2] : -1;
            source += UTF8ToString(HEAP32[string + i * 4 >> 2], len < 0 ? undefined : len)
        }
        return source
    },
    calcBufLength: function calcBufLength(size, type, stride, count) {
        if (stride > 0) {
            return count * stride
        }
        var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        return size * typeSize * count
    },
    usedTempBuffers: [],
    preDrawHandleClientVertexAttribBindings: function preDrawHandleClientVertexAttribBindings(count) {
        GL.resetBufferBinding = false;
        for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
            var cb = GL.currentContext.clientBuffers[i];
            if (!cb.clientside || !cb.enabled) continue;
            GL.resetBufferBinding = true;
            var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
            var buf = GL.getTempVertexBuffer(size);
            GLctx.bindBuffer(34962, buf);
            GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
            cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0)
        }
    },
    postDrawHandleClientVertexAttribBindings: function postDrawHandleClientVertexAttribBindings() {
        if (GL.resetBufferBinding) {
            GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding])
        }
    },
    createContext: function (canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
            canvas.getContextSafariWebGL2Fixed = canvas.getContext;

            function fixedGetContext(ver, attrs) {
                var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null
            }
            canvas.getContext = fixedGetContext
        }
        var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2",
            webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle
    },
    registerContext: function (ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes.majorVersion,
            GLctx: ctx
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes
            .enableExtensionsByDefault) {
            GL.initExtensions(context)
        }
        context.maxVertexAttribs = context.GLctx.getParameter(34921);
        context.clientBuffers = [];
        for (var i = 0; i < context.maxVertexAttribs; i++) {
            context.clientBuffers[i] = {
                enabled: false,
                clientside: false,
                size: 0,
                type: 0,
                normalized: 0,
                stride: 0,
                ptr: 0,
                vertexAttribPointerAdaptor: null
            }
        }
        GL.generateTempBuffers(false, context);
        return handle
    },
    makeContextCurrent: function (contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx)
    },
    getContext: function (contextHandle) {
        return GL.contexts[contextHandle]
    },
    deleteContext: function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents == "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx
            .canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle]
            .GLctx.canvas.GLctxObject = undefined;
        GL.contexts[contextHandle] = null
    },
    initExtensions: function (context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        __webgl_enable_ANGLE_instanced_arrays(GLctx);
        __webgl_enable_OES_vertex_array_object(GLctx);
        __webgl_enable_WEBGL_draw_buffers(GLctx);
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
        if (context.version >= 2) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2")
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query")
        }
        __webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function (ext) {
            if (!ext.includes("lose_context") && !ext.includes("debug")) {
                GLctx.getExtension(ext)
            }
        })
    }
};

function _eglCreateContext(display, config, hmm, contextAttribs) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    var glesContextVersion = 1;
    for (;;) {
        var param = HEAP32[contextAttribs >> 2];
        if (param == 12440) {
            glesContextVersion = HEAP32[contextAttribs + 4 >> 2]
        } else if (param == 12344) {
            break
        } else {
            EGL.setErrorCode(12292);
            return 0
        }
        contextAttribs += 8
    }
    if (glesContextVersion < 2 || glesContextVersion > 3) {
        EGL.setErrorCode(12293);
        return 0
    }
    EGL.contextAttributes.majorVersion = glesContextVersion - 1;
    EGL.contextAttributes.minorVersion = 0;
    EGL.context = GL.createContext(Module["canvas"], EGL.contextAttributes);
    if (EGL.context != 0) {
        EGL.setErrorCode(12288);
        GL.makeContextCurrent(EGL.context);
        Module.useWebGL = true;
        Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
            callback()
        });
        GL.makeContextCurrent(null);
        return 62004
    } else {
        EGL.setErrorCode(12297);
        return 0
    }
}

function _eglCreateWindowSurface(display, config, win, attrib_list) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    EGL.setErrorCode(12288);
    return 62006
}

function _eglDestroyContext(display, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    GL.deleteContext(EGL.context);
    EGL.setErrorCode(12288);
    if (EGL.currentContext == context) {
        EGL.currentContext = 0
    }
    return 1
}

function _eglDestroySurface(display, surface) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (surface != 62006) {
        EGL.setErrorCode(12301);
        return 1
    }
    if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0
    }
    if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0
    }
    EGL.setErrorCode(12288);
    return 1
}

function _eglGetConfigAttrib(display, config, attribute, value) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    if (!value) {
        EGL.setErrorCode(12300);
        return 0
    }
    EGL.setErrorCode(12288);
    switch (attribute) {
        case 12320:
            HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 32 : 24;
            return 1;
        case 12321:
            HEAP32[value >> 2] = EGL.contextAttributes.alpha ? 8 : 0;
            return 1;
        case 12322:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12323:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12324:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12325:
            HEAP32[value >> 2] = EGL.contextAttributes.depth ? 24 : 0;
            return 1;
        case 12326:
            HEAP32[value >> 2] = EGL.contextAttributes.stencil ? 8 : 0;
            return 1;
        case 12327:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12328:
            HEAP32[value >> 2] = 62002;
            return 1;
        case 12329:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12330:
            HEAP32[value >> 2] = 4096;
            return 1;
        case 12331:
            HEAP32[value >> 2] = 16777216;
            return 1;
        case 12332:
            HEAP32[value >> 2] = 4096;
            return 1;
        case 12333:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12334:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12335:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12337:
            HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 4 : 0;
            return 1;
        case 12338:
            HEAP32[value >> 2] = EGL.contextAttributes.antialias ? 1 : 0;
            return 1;
        case 12339:
            HEAP32[value >> 2] = 4;
            return 1;
        case 12340:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12341:
        case 12342:
        case 12343:
            HEAP32[value >> 2] = -1;
            return 1;
        case 12345:
        case 12346:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12347:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12348:
            HEAP32[value >> 2] = 1;
            return 1;
        case 12349:
        case 12350:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12351:
            HEAP32[value >> 2] = 12430;
            return 1;
        case 12352:
            HEAP32[value >> 2] = 4;
            return 1;
        case 12354:
            HEAP32[value >> 2] = 0;
            return 1;
        default:
            EGL.setErrorCode(12292);
            return 0
    }
}

function _eglGetDisplay(nativeDisplayType) {
    EGL.setErrorCode(12288);
    return 62e3
}

function _eglGetError() {
    return EGL.errorCode
}

function _eglInitialize(display, majorVersion, minorVersion) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (majorVersion) {
        HEAP32[majorVersion >> 2] = 1
    }
    if (minorVersion) {
        HEAP32[minorVersion >> 2] = 4
    }
    EGL.defaultDisplayInitialized = true;
    EGL.setErrorCode(12288);
    return 1
}

function _eglMakeCurrent(display, draw, read, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 0 && context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    if (read != 0 && read != 62006 || draw != 0 && draw != 62006) {
        EGL.setErrorCode(12301);
        return 0
    }
    GL.makeContextCurrent(context ? EGL.context : null);
    EGL.currentContext = context;
    EGL.currentDrawSurface = draw;
    EGL.currentReadSurface = read;
    EGL.setErrorCode(12288);
    return 1
}

function _eglQueryString(display, name) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    EGL.setErrorCode(12288);
    if (EGL.stringCache[name]) return EGL.stringCache[name];
    var ret;
    switch (name) {
        case 12371:
            ret = allocateUTF8("Emscripten");
            break;
        case 12372:
            ret = allocateUTF8("1.4 Emscripten EGL");
            break;
        case 12373:
            ret = allocateUTF8("");
            break;
        case 12429:
            ret = allocateUTF8("OpenGL_ES");
            break;
        default:
            EGL.setErrorCode(12300);
            return 0
    }
    EGL.stringCache[name] = ret;
    return ret
}

function _eglSwapBuffers() {
    if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(12289)
    } else if (!Module.ctx) {
        EGL.setErrorCode(12290)
    } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(12302)
    } else {
        EGL.setErrorCode(12288);
        return 1
    }
    return 0
}

function _eglSwapInterval(display, interval) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (interval == 0) _emscripten_set_main_loop_timing(0, 0);
    else _emscripten_set_main_loop_timing(1, interval);
    EGL.setErrorCode(12288);
    return 1
}

function _eglTerminate(display) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    EGL.currentContext = 0;
    EGL.currentReadSurface = 0;
    EGL.currentDrawSurface = 0;
    EGL.defaultDisplayInitialized = false;
    EGL.setErrorCode(12288);
    return 1
}

function _eglWaitClient() {
    EGL.setErrorCode(12288);
    return 1
}
var _eglWaitGL = _eglWaitClient;

function _eglWaitNative(nativeEngineId) {
    EGL.setErrorCode(12288);
    return 1
}
var readAsmConstArgsArray = [];

function readAsmConstArgs(sigPtr, buf) {
    readAsmConstArgsArray.length = 0;
    var ch;
    buf >>= 2;
    while (ch = HEAPU8[sigPtr++]) {
        buf += ch != 105 & buf;
        readAsmConstArgsArray.push(ch == 105 ? HEAP32[buf] : HEAPF64[buf++ >> 1]);
        ++buf
    }
    return readAsmConstArgsArray
}

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
    var args = readAsmConstArgs(sigPtr, argbuf);
    return ASM_CONSTS[code].apply(null, args)
}

function mainThreadEM_ASM(code, sigPtr, argbuf, sync) {
    var args = readAsmConstArgs(sigPtr, argbuf);
    return ASM_CONSTS[code].apply(null, args)
}

function _emscripten_asm_const_int_sync_on_main_thread(code, sigPtr, argbuf) {
    return mainThreadEM_ASM(code, sigPtr, argbuf, 1)
}

function _emscripten_async_call(func, arg, millis) {
    function wrapper() {
        (function (a1) {
            dynCall_vi.apply(null, [func, a1])
        })(arg)
    }
    if (millis >= 0 || ENVIRONMENT_IS_NODE) {
        safeSetTimeout(wrapper, millis)
    } else {
        Browser.safeRequestAnimationFrame(wrapper)
    }
}

function _emscripten_async_wget_data(url, arg, onload, onerror) {
    asyncLoad(UTF8ToString(url), function (byteArray) {
        callUserCallback(function () {
            var buffer = _malloc(byteArray.length);
            HEAPU8.set(byteArray, buffer);
            (function (a1, a2, a3) {
                dynCall_viii.apply(null, [onload, a1, a2, a3])
            })(arg, buffer, byteArray.length);
            _free(buffer)
        })
    }, function () {
        if (onerror) {
            callUserCallback(function () {
                (function (a1) {
                    dynCall_vi.apply(null, [onerror, a1])
                })(arg)
            })
        }
    }, true)
}

function _emscripten_cancel_main_loop() {
    Browser.mainLoop.pause();
    Browser.mainLoop.func = null
}

function _emscripten_date_now() {
    return Date.now()
}

function _emscripten_debugger() {
    debugger
}

function withStackSave(f) {
    var stack = stackSave();
    var ret = f();
    stackRestore(stack);
    return ret
}
var JSEvents = {
    inEventHandler: 0,
    removeAllEventListeners: function () {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
            JSEvents._removeHandler(i)
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = []
    },
    registerRemoveEventListeners: function () {
        if (!JSEvents.removeEventListenersRegistered) {
            __ATEXIT__.push(JSEvents.removeAllEventListeners);
            JSEvents.removeEventListenersRegistered = true
        }
    },
    deferredCalls: [],
    deferCall: function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
            if (arrA.length != arrB.length) return false;
            for (var i in arrA) {
                if (arrA[i] != arrB[i]) return false
            }
            return true
        }
        for (var i in JSEvents.deferredCalls) {
            var call = JSEvents.deferredCalls[i];
            if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                return
            }
        }
        JSEvents.deferredCalls.push({
            targetFunction: targetFunction,
            precedence: precedence,
            argsList: argsList
        });
        JSEvents.deferredCalls.sort(function (x, y) {
            return x.precedence < y.precedence
        })
    },
    removeDeferredCalls: function (targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i, 1);
                --i
            }
        }
    },
    canPerformEventHandlerRequests: function () {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
    },
    runDeferredCalls: function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
            return
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            var call = JSEvents.deferredCalls[i];
            JSEvents.deferredCalls.splice(i, 1);
            --i;
            call.targetFunction.apply(null, call.argsList)
        }
    },
    eventHandlers: [],
    removeAllHandlersOnTarget: function (target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents
                    .eventHandlers[i].eventTypeString)) {
                JSEvents._removeHandler(i--)
            }
        }
    },
    _removeHandler: function (i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1)
    },
    registerOrRemoveHandler: function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            JSEvents.runDeferredCalls();
            eventHandler.handlerFunc(event);
            JSEvents.runDeferredCalls();
            --JSEvents.inEventHandler
        };
        if (eventHandler.callbackfunc) {
            eventHandler.eventListenerFunc = jsEventHandler;
            eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler
                .useCapture);
            JSEvents.eventHandlers.push(eventHandler);
            JSEvents.registerRemoveEventListeners()
        } else {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i]
                    .eventTypeString == eventHandler.eventTypeString) {
                    JSEvents._removeHandler(i--)
                }
            }
        }
    },
    getNodeNameForTarget: function (target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == screen) return "#screen";
        return target && target.nodeName ? target.nodeName : ""
    },
    fullscreenEnabled: function () {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled
    }
};
var currentFullscreenStrategy = {};

function maybeCStringToJsString(cString) {
    return cString > 2 ? UTF8ToString(cString) : cString
}
var specialHTMLTargets = [0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0];

function findEventTarget(target) {
    target = maybeCStringToJsString(target);
    var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) :
        undefined);
    return domElement
}

function findCanvasEventTarget(target) {
    return findEventTarget(target)
}

function _emscripten_get_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    HEAP32[width >> 2] = canvas.width;
    HEAP32[height >> 2] = canvas.height
}

function getCanvasElementSize(target) {
    return withStackSave(function () {
        var w = stackAlloc(8);
        var h = w + 4;
        var targetInt = stackAlloc(target.id.length + 1);
        stringToUTF8(target.id, targetInt, target.id.length + 1);
        var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
        var size = [HEAP32[w >> 2], HEAP32[h >> 2]];
        return size
    })
}

function _emscripten_set_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    canvas.width = width;
    canvas.height = height;
    return 0
}

function setCanvasElementSize(target, width, height) {
    if (!target.controlTransferredOffscreen) {
        target.width = width;
        target.height = height
    } else {
        withStackSave(function () {
            var targetInt = stackAlloc(target.id.length + 1);
            stringToUTF8(target.id, targetInt, target.id.length + 1);
            _emscripten_set_canvas_element_size(targetInt, width, height)
        })
    }
}

function registerRestoreOldStyle(canvas) {
    var canvasSize = getCanvasElementSize(canvas);
    var oldWidth = canvasSize[0];
    var oldHeight = canvasSize[1];
    var oldCssWidth = canvas.style.width;
    var oldCssHeight = canvas.style.height;
    var oldBackgroundColor = canvas.style.backgroundColor;
    var oldDocumentBackgroundColor = document.body.style.backgroundColor;
    var oldPaddingLeft = canvas.style.paddingLeft;
    var oldPaddingRight = canvas.style.paddingRight;
    var oldPaddingTop = canvas.style.paddingTop;
    var oldPaddingBottom = canvas.style.paddingBottom;
    var oldMarginLeft = canvas.style.marginLeft;
    var oldMarginRight = canvas.style.marginRight;
    var oldMarginTop = canvas.style.marginTop;
    var oldMarginBottom = canvas.style.marginBottom;
    var oldDocumentBodyMargin = document.body.style.margin;
    var oldDocumentOverflow = document.documentElement.style.overflow;
    var oldDocumentScroll = document.body.scroll;
    var oldImageRendering = canvas.style.imageRendering;

    function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document
            .msFullscreenElement;
        if (!fullscreenElement) {
            document.removeEventListener("fullscreenchange", restoreOldStyle);
            document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
            setCanvasElementSize(canvas, oldWidth, oldHeight);
            canvas.style.width = oldCssWidth;
            canvas.style.height = oldCssHeight;
            canvas.style.backgroundColor = oldBackgroundColor;
            if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
            document.body.style.backgroundColor = oldDocumentBackgroundColor;
            canvas.style.paddingLeft = oldPaddingLeft;
            canvas.style.paddingRight = oldPaddingRight;
            canvas.style.paddingTop = oldPaddingTop;
            canvas.style.paddingBottom = oldPaddingBottom;
            canvas.style.marginLeft = oldMarginLeft;
            canvas.style.marginRight = oldMarginRight;
            canvas.style.marginTop = oldMarginTop;
            canvas.style.marginBottom = oldMarginBottom;
            document.body.style.margin = oldDocumentBodyMargin;
            document.documentElement.style.overflow = oldDocumentOverflow;
            document.body.scroll = oldDocumentScroll;
            canvas.style.imageRendering = oldImageRendering;
            if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
            if (currentFullscreenStrategy.canvasResizedCallback) {
                (function (a1, a2, a3) {
                    return dynCall_iiii.apply(null, [currentFullscreenStrategy.canvasResizedCallback, a1, a2, a3])
                })(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData)
            }
        }
    }
    document.addEventListener("fullscreenchange", restoreOldStyle);
    document.addEventListener("webkitfullscreenchange", restoreOldStyle);
    return restoreOldStyle
}

function setLetterbox(element, topBottom, leftRight) {
    element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
    element.style.paddingTop = element.style.paddingBottom = topBottom + "px"
}

function getBoundingClientRect(e) {
    return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
        "left": 0,
        "top": 0
    }
}

function JSEvents_resizeCanvasForFullscreen(target, strategy) {
    var restoreOldStyle = registerRestoreOldStyle(target);
    var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
    var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
    var rect = getBoundingClientRect(target);
    var windowedCssWidth = rect.width;
    var windowedCssHeight = rect.height;
    var canvasSize = getCanvasElementSize(target);
    var windowedRttWidth = canvasSize[0];
    var windowedRttHeight = canvasSize[1];
    if (strategy.scaleMode == 3) {
        setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
        cssWidth = windowedCssWidth;
        cssHeight = windowedCssHeight
    } else if (strategy.scaleMode == 2) {
        if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
            var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
            setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
            cssHeight = desiredCssHeight
        } else {
            var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
            setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
            cssWidth = desiredCssWidth
        }
    }
    if (!target.style.backgroundColor) target.style.backgroundColor = "black";
    if (!document.body.style.backgroundColor) document.body.style.backgroundColor = "black";
    target.style.width = cssWidth + "px";
    target.style.height = cssHeight + "px";
    if (strategy.filteringMode == 1) {
        target.style.imageRendering = "optimizeSpeed";
        target.style.imageRendering = "-moz-crisp-edges";
        target.style.imageRendering = "-o-crisp-edges";
        target.style.imageRendering = "-webkit-optimize-contrast";
        target.style.imageRendering = "optimize-contrast";
        target.style.imageRendering = "crisp-edges";
        target.style.imageRendering = "pixelated"
    }
    var dpiScale = strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
    if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = cssWidth * dpiScale | 0;
        var newHeight = cssHeight * dpiScale | 0;
        setCanvasElementSize(target, newWidth, newHeight);
        if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight)
    }
    return restoreOldStyle
}

function JSEvents_requestFullscreen(target, strategy) {
    if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
        JSEvents_resizeCanvasForFullscreen(target, strategy)
    }
    if (target.requestFullscreen) {
        target.requestFullscreen()
    } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1
    }
    currentFullscreenStrategy = strategy;
    if (strategy.canvasResizedCallback) {
        (function (a1, a2, a3) {
            return dynCall_iiii.apply(null, [strategy.canvasResizedCallback, a1, a2, a3])
        })(37, 0, strategy.canvasResizedCallbackUserData)
    }
    return 0
}

function _emscripten_exit_fullscreen() {
    if (!JSEvents.fullscreenEnabled()) return -1;
    JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
    var d = specialHTMLTargets[1];
    if (d.exitFullscreen) {
        d.fullscreenElement && d.exitFullscreen()
    } else if (d.webkitExitFullscreen) {
        d.webkitFullscreenElement && d.webkitExitFullscreen()
    } else {
        return -1
    }
    return 0
}

function requestPointerLock(target) {
    if (target.requestPointerLock) {
        target.requestPointerLock()
    } else if (target.msRequestPointerLock) {
        target.msRequestPointerLock()
    } else {
        if (document.body.requestPointerLock || document.body.msRequestPointerLock) {
            return -3
        }
        return -1
    }
    return 0
}

function _emscripten_exit_pointerlock() {
    JSEvents.removeDeferredCalls(requestPointerLock);
    if (document.exitPointerLock) {
        document.exitPointerLock()
    } else if (document.msExitPointerLock) {
        document.msExitPointerLock()
    } else {
        return -1
    }
    return 0
}

function _emscripten_exit_with_live_runtime() {
    throw "unwind"
}

function fillBatteryEventData(eventStruct, e) {
    HEAPF64[eventStruct >> 3] = e.chargingTime;
    HEAPF64[eventStruct + 8 >> 3] = e.dischargingTime;
    HEAPF64[eventStruct + 16 >> 3] = e.level;
    HEAP32[eventStruct + 24 >> 2] = e.charging
}

function battery() {
    return navigator.battery || navigator.mozBattery || navigator.webkitBattery
}

function _emscripten_get_battery_status(batteryState) {
    if (!battery()) return -1;
    fillBatteryEventData(batteryState, battery());
    return 0
}

function traverseStack(args) {
    if (!args || !args.callee || !args.callee.name) {
        return [null, "", ""]
    }
    var funstr = args.callee.toString();
    var funcname = args.callee.name;
    var str = "(";
    var first = true;
    for (var i in args) {
        var a = args[i];
        if (!first) {
            str += ", "
        }
        first = false;
        if (typeof a == "number" || typeof a == "string") {
            str += a
        } else {
            str += "(" + typeof a + ")"
        }
    }
    str += ")";
    var caller = args.callee.caller;
    args = caller ? caller.arguments : [];
    if (first) str = "";
    return [args, funcname, str]
}

function jsStackTrace() {
    var error = new Error;
    if (!error.stack) {
        try {
            throw new Error
        } catch (e) {
            error = e
        }
        if (!error.stack) {
            return "(no stack trace available)"
        }
    }
    return error.stack.toString()
}

function _emscripten_get_callstack_js(flags) {
    var callstack = jsStackTrace();
    var iThisFunc = callstack.lastIndexOf("_emscripten_log");
    var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
    var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
    callstack = callstack.slice(iNextLine);
    if (flags & 32) {
        warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring")
    }
    if (flags & 8 && typeof emscripten_source_map == "undefined") {
        warnOnce(
            'Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.'
            );
        flags ^= 8;
        flags |= 16
    }
    var stack_args = null;
    if (flags & 128) {
        stack_args = traverseStack(arguments);
        while (stack_args[1].includes("_emscripten_")) stack_args = traverseStack(stack_args[0])
    }
    var lines = callstack.split("\n");
    callstack = "";
    var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
    var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
    var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
    for (var l in lines) {
        var line = lines[l];
        var symbolName = "";
        var file = "";
        var lineno = 0;
        var column = 0;
        var parts = chromeRe.exec(line);
        if (parts && parts.length == 5) {
            symbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            column = parts[4]
        } else {
            parts = newFirefoxRe.exec(line);
            if (!parts) parts = firefoxRe.exec(line);
            if (parts && parts.length >= 4) {
                symbolName = parts[1];
                file = parts[2];
                lineno = parts[3];
                column = parts[4] | 0
            } else {
                callstack += line + "\n";
                continue
            }
        }
        var haveSourceMap = false;
        if (flags & 8) {
            var orig = emscripten_source_map.originalPositionFor({
                line: lineno,
                column: column
            });
            haveSourceMap = orig && orig.source;
            if (haveSourceMap) {
                if (flags & 64) {
                    orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1)
                }
                callstack += "    at " + symbolName + " (" + orig.source + ":" + orig.line + ":" + orig.column + ")\n"
            }
        }
        if (flags & 16 || !haveSourceMap) {
            if (flags & 64) {
                file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1)
            }
            callstack += (haveSourceMap ? "     = " + symbolName : "    at " + symbolName) + " (" + file + ":" +
                lineno + ":" + column + ")\n"
        }
        if (flags & 128 && stack_args[0]) {
            if (stack_args[1] == symbolName && stack_args[2].length > 0) {
                callstack = callstack.replace(/\s+$/, "");
                callstack += " with values: " + stack_args[1] + stack_args[2] + "\n"
            }
            stack_args = traverseStack(stack_args[0])
        }
    }
    callstack = callstack.replace(/\s+$/, "");
    return callstack
}

function _emscripten_get_callstack(flags, str, maxbytes) {
    var callstack = _emscripten_get_callstack_js(flags);
    if (!str || maxbytes <= 0) {
        return lengthBytesUTF8(callstack) + 1
    }
    var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes);
    return bytesWrittenExcludingNull + 1
}

function _emscripten_get_compiler_setting(name) {
    throw "You must build with -sRETAIN_COMPILER_SETTINGS for getCompilerSetting or emscripten_get_compiler_setting to work"
}

function _emscripten_get_device_pixel_ratio() {
    return typeof devicePixelRatio == "number" && devicePixelRatio || 1
}

function _emscripten_get_element_css_size(target, width, height) {
    target = findEventTarget(target);
    if (!target) return -4;
    var rect = getBoundingClientRect(target);
    HEAPF64[width >> 3] = rect.width;
    HEAPF64[height >> 3] = rect.height;
    return 0
}

function fillGamepadEventData(eventStruct, e) {
    HEAPF64[eventStruct >> 3] = e.timestamp;
    for (var i = 0; i < e.axes.length; ++i) {
        HEAPF64[eventStruct + i * 8 + 16 >> 3] = e.axes[i]
    }
    for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == "object") {
            HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i].value
        } else {
            HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i]
        }
    }
    for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == "object") {
            HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i].pressed
        } else {
            HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i] == 1
        }
    }
    HEAP32[eventStruct + 1296 >> 2] = e.connected;
    HEAP32[eventStruct + 1300 >> 2] = e.index;
    HEAP32[eventStruct + 8 >> 2] = e.axes.length;
    HEAP32[eventStruct + 12 >> 2] = e.buttons.length;
    stringToUTF8(e.id, eventStruct + 1304, 64);
    stringToUTF8(e.mapping, eventStruct + 1368, 64)
}

function _emscripten_get_gamepad_status(index, gamepadState) {
    if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
    if (!JSEvents.lastGamepadState[index]) return -7;
    fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
    return 0
}

function getHeapMax() {
    return 2147483648
}

function _emscripten_get_heap_max() {
    return getHeapMax()
}

function _emscripten_get_now_res() {
    if (ENVIRONMENT_IS_NODE) {
        return 1
    } else return 1e3
}

function _emscripten_get_num_gamepads() {
    return JSEvents.lastGamepadState.length
}

function _emscripten_get_preloaded_image_data(path, w, h) {
    if ((path | 0) === path) path = UTF8ToString(path);
    path = PATH_FS.resolve(path);
    var canvas = preloadedImages[path];
    if (canvas) {
        var ctx = canvas.getContext("2d");
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var buf = _malloc(canvas.width * canvas.height * 4);
        HEAPU8.set(image.data, buf);
        HEAP32[w >> 2] = canvas.width;
        HEAP32[h >> 2] = canvas.height;
        return buf
    }
    return 0
}

function _emscripten_get_preloaded_image_data_from_FILE(file, w, h) {
    var fd = Module["_fileno"](file);
    var stream = FS.getStream(fd);
    if (stream) {
        return _emscripten_get_preloaded_image_data(stream.path, w, h)
    }
    return 0
}

function _emscripten_get_screen_size(width, height) {
    HEAP32[width >> 2] = screen.width;
    HEAP32[height >> 2] = screen.height
}

function _emscripten_glActiveTexture(x0) {
    GLctx["activeTexture"](x0)
}

function _emscripten_glAttachShader(program, shader) {
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}

function _emscripten_glBeginQuery(target, id) {
    GLctx["beginQuery"](target, GL.queries[id])
}

function _emscripten_glBeginQueryEXT(target, id) {
    GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id])
}

function _emscripten_glBeginTransformFeedback(x0) {
    GLctx["beginTransformFeedback"](x0)
}

function _emscripten_glBindAttribLocation(program, index, name) {
    GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
}

function _emscripten_glBindBuffer(target, buffer) {
    if (target == 34962) {
        GLctx.currentArrayBufferBinding = buffer
    } else if (target == 34963) {
        GLctx.currentElementArrayBufferBinding = buffer
    }
    if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
    } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
    }
    GLctx.bindBuffer(target, GL.buffers[buffer])
}

function _emscripten_glBindBufferBase(target, index, buffer) {
    GLctx["bindBufferBase"](target, index, GL.buffers[buffer])
}

function _emscripten_glBindBufferRange(target, index, buffer, offset, ptrsize) {
    GLctx["bindBufferRange"](target, index, GL.buffers[buffer], offset, ptrsize)
}

function _emscripten_glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
}

function _emscripten_glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
}

function _emscripten_glBindSampler(unit, sampler) {
    GLctx["bindSampler"](unit, GL.samplers[sampler])
}

function _emscripten_glBindTexture(target, texture) {
    GLctx.bindTexture(target, GL.textures[texture])
}

function _emscripten_glBindTransformFeedback(target, id) {
    GLctx["bindTransformFeedback"](target, GL.transformFeedbacks[id])
}

function _emscripten_glBindVertexArray(vao) {
    GLctx["bindVertexArray"](GL.vaos[vao]);
    var ibo = GLctx.getParameter(34965);
    GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0
}

function _emscripten_glBindVertexArrayOES(vao) {
    GLctx["bindVertexArray"](GL.vaos[vao]);
    var ibo = GLctx.getParameter(34965);
    GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0
}

function _emscripten_glBlendColor(x0, x1, x2, x3) {
    GLctx["blendColor"](x0, x1, x2, x3)
}

function _emscripten_glBlendEquation(x0) {
    GLctx["blendEquation"](x0)
}

function _emscripten_glBlendEquationSeparate(x0, x1) {
    GLctx["blendEquationSeparate"](x0, x1)
}

function _emscripten_glBlendFunc(x0, x1) {
    GLctx["blendFunc"](x0, x1)
}

function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx["blendFuncSeparate"](x0, x1, x2, x3)
}

function _emscripten_glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
    GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9)
}

function _emscripten_glBufferData(target, size, data, usage) {
    if (GL.currentContext.version >= 2) {
        if (data && size) {
            GLctx.bufferData(target, HEAPU8, usage, data, size)
        } else {
            GLctx.bufferData(target, size, usage)
        }
    } else {
        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage)
    }
}

function _emscripten_glBufferSubData(target, offset, size, data) {
    if (GL.currentContext.version >= 2) {
        size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
}

function _emscripten_glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0)
}

function _emscripten_glClear(x0) {
    GLctx["clear"](x0)
}

function _emscripten_glClearBufferfi(x0, x1, x2, x3) {
    GLctx["clearBufferfi"](x0, x1, x2, x3)
}

function _emscripten_glClearBufferfv(buffer, drawbuffer, value) {
    GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2)
}

function _emscripten_glClearBufferiv(buffer, drawbuffer, value) {
    GLctx["clearBufferiv"](buffer, drawbuffer, HEAP32, value >> 2)
}

function _emscripten_glClearBufferuiv(buffer, drawbuffer, value) {
    GLctx["clearBufferuiv"](buffer, drawbuffer, HEAPU32, value >> 2)
}

function _emscripten_glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3)
}

function _emscripten_glClearDepthf(x0) {
    GLctx["clearDepth"](x0)
}

function _emscripten_glClearStencil(x0) {
    GLctx["clearStencil"](x0)
}

function convertI32PairToI53(lo, hi) {
    return (lo >>> 0) + hi * 4294967296
}

function _emscripten_glClientWaitSync(sync, flags, timeoutLo, timeoutHi) {
    return GLctx.clientWaitSync(GL.syncs[sync], flags, convertI32PairToI53(timeoutLo, timeoutHi))
}

function _emscripten_glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}

function _emscripten_glCompileShader(shader) {
    GLctx.compileShader(GL.shaders[shader])
}

function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
            GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, imageSize, data)
        } else {
            GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize)
        }
        return
    }
    GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data,
        data + imageSize) : null)
}

function _emscripten_glCompressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize,
    data) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexImage3D"](target, level, internalFormat, width, height, depth, border, imageSize, data)
    } else {
        GLctx["compressedTexImage3D"](target, level, internalFormat, width, height, depth, border, HEAPU8, data,
            imageSize)
    }
}

function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize,
data) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
            GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, imageSize, data)
        } else {
            GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data,
                imageSize)
        }
        return
    }
    GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(
        data, data + imageSize) : null)
}

function _emscripten_glCompressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format,
    imageSize, data) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexSubImage3D"](target, level, xoffset, yoffset, zoffset, width, height, depth, format,
            imageSize, data)
    } else {
        GLctx["compressedTexSubImage3D"](target, level, xoffset, yoffset, zoffset, width, height, depth, format, HEAPU8,
            data, imageSize)
    }
}

function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
    GLctx["copyBufferSubData"](x0, x1, x2, x3, x4)
}

function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}

function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}

function _emscripten_glCopyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8) {
    GLctx["copyTexSubImage3D"](x0, x1, x2, x3, x4, x5, x6, x7, x8)
}

function _emscripten_glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
    program.uniformIdCounter = 1;
    GL.programs[id] = program;
    return id
}

function _emscripten_glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}

function _emscripten_glCullFace(x0) {
    GLctx["cullFace"](x0)
}

function _emscripten_glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
        if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0
    }
}

function _emscripten_glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}

function _emscripten_glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null
}

function _emscripten_glDeleteQueries(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >> 2];
        var query = GL.queries[id];
        if (!query) continue;
        GLctx["deleteQuery"](query);
        GL.queries[id] = null
    }
}

function _emscripten_glDeleteQueriesEXT(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >> 2];
        var query = GL.queries[id];
        if (!query) continue;
        GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
        GL.queries[id] = null
    }
}

function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}

function _emscripten_glDeleteSamplers(n, samplers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[samplers + i * 4 >> 2];
        var sampler = GL.samplers[id];
        if (!sampler) continue;
        GLctx["deleteSampler"](sampler);
        sampler.name = 0;
        GL.samplers[id] = null
    }
}

function _emscripten_glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}

function _emscripten_glDeleteSync(id) {
    if (!id) return;
    var sync = GL.syncs[id];
    if (!sync) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteSync(sync);
    sync.name = 0;
    GL.syncs[id] = null
}

function _emscripten_glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}

function _emscripten_glDeleteTransformFeedbacks(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >> 2];
        var transformFeedback = GL.transformFeedbacks[id];
        if (!transformFeedback) continue;
        GLctx["deleteTransformFeedback"](transformFeedback);
        transformFeedback.name = 0;
        GL.transformFeedbacks[id] = null
    }
}

function _emscripten_glDeleteVertexArrays(n, vaos) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null
    }
}

function _emscripten_glDeleteVertexArraysOES(n, vaos) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null
    }
}

function _emscripten_glDepthFunc(x0) {
    GLctx["depthFunc"](x0)
}

function _emscripten_glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}

function _emscripten_glDepthRangef(x0, x1) {
    GLctx["depthRange"](x0, x1)
}

function _emscripten_glDetachShader(program, shader) {
    GLctx.detachShader(GL.programs[program], GL.shaders[shader])
}

function _emscripten_glDisable(x0) {
    GLctx["disable"](x0)
}

function _emscripten_glDisableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = false;
    GLctx.disableVertexAttribArray(index)
}

function _emscripten_glDrawArrays(mode, first, count) {
    GL.preDrawHandleClientVertexAttribBindings(first + count);
    GLctx.drawArrays(mode, first, count);
    GL.postDrawHandleClientVertexAttribBindings()
}

function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glDrawArraysInstancedARB(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glDrawArraysInstancedEXT(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glDrawArraysInstancedNV(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}
var tempFixedLengthArray = [];

function _emscripten_glDrawBuffers(n, bufs) {
    var bufArray = tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >> 2]
    }
    GLctx["drawBuffers"](bufArray)
}

function _emscripten_glDrawBuffersEXT(n, bufs) {
    var bufArray = tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >> 2]
    }
    GLctx["drawBuffers"](bufArray)
}

function _emscripten_glDrawBuffersWEBGL(n, bufs) {
    var bufArray = tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >> 2]
    }
    GLctx["drawBuffers"](bufArray)
}

function _emscripten_glDrawElements(mode, count, type, indices) {
    var buf;
    if (!GLctx.currentElementArrayBufferBinding) {
        var size = GL.calcBufLength(1, type, 0, count);
        buf = GL.getTempIndexBuffer(size);
        GLctx.bindBuffer(34963, buf);
        GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
        indices = 0
    }
    GL.preDrawHandleClientVertexAttribBindings(count);
    GLctx.drawElements(mode, count, type, indices);
    GL.postDrawHandleClientVertexAttribBindings(count);
    if (!GLctx.currentElementArrayBufferBinding) {
        GLctx.bindBuffer(34963, null)
    }
}

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _emscripten_glDrawElementsInstancedANGLE(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _emscripten_glDrawElementsInstancedARB(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _emscripten_glDrawElementsInstancedEXT(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _emscripten_glDrawElementsInstancedNV(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _glDrawElements(mode, count, type, indices) {
    var buf;
    if (!GLctx.currentElementArrayBufferBinding) {
        var size = GL.calcBufLength(1, type, 0, count);
        buf = GL.getTempIndexBuffer(size);
        GLctx.bindBuffer(34963, buf);
        GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
        indices = 0
    }
    GL.preDrawHandleClientVertexAttribBindings(count);
    GLctx.drawElements(mode, count, type, indices);
    GL.postDrawHandleClientVertexAttribBindings(count);
    if (!GLctx.currentElementArrayBufferBinding) {
        GLctx.bindBuffer(34963, null)
    }
}

function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
    _glDrawElements(mode, count, type, indices)
}

function _emscripten_glEnable(x0) {
    GLctx["enable"](x0)
}

function _emscripten_glEnableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = true;
    GLctx.enableVertexAttribArray(index)
}

function _emscripten_glEndQuery(x0) {
    GLctx["endQuery"](x0)
}

function _emscripten_glEndQueryEXT(target) {
    GLctx.disjointTimerQueryExt["endQueryEXT"](target)
}

function _emscripten_glEndTransformFeedback() {
    GLctx["endTransformFeedback"]()
}

function _emscripten_glFenceSync(condition, flags) {
    var sync = GLctx.fenceSync(condition, flags);
    if (sync) {
        var id = GL.getNewId(GL.syncs);
        sync.name = id;
        GL.syncs[id] = sync;
        return id
    }
    return 0
}

function _emscripten_glFinish() {
    GLctx["finish"]()
}

function _emscripten_glFlush() {
    GLctx["flush"]()
}

function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}

function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}

function _emscripten_glFramebufferTextureLayer(target, attachment, texture, level, layer) {
    GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer)
}

function _emscripten_glFrontFace(x0) {
    GLctx["frontFace"](x0)
}

function __glGenObject(n, buffers, createFunction, objectTable) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer
        } else {
            GL.recordError(1282)
        }
        HEAP32[buffers + i * 4 >> 2] = id
    }
}

function _emscripten_glGenBuffers(n, buffers) {
    __glGenObject(n, buffers, "createBuffer", GL.buffers)
}

function _emscripten_glGenFramebuffers(n, ids) {
    __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
}

function _emscripten_glGenQueries(n, ids) {
    __glGenObject(n, ids, "createQuery", GL.queries)
}

function _emscripten_glGenQueriesEXT(n, ids) {
    for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
        if (!query) {
            GL.recordError(1282);
            while (i < n) HEAP32[ids + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.queries);
        query.name = id;
        GL.queries[id] = query;
        HEAP32[ids + i * 4 >> 2] = id
    }
}

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
    __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
}

function _emscripten_glGenSamplers(n, samplers) {
    __glGenObject(n, samplers, "createSampler", GL.samplers)
}

function _emscripten_glGenTextures(n, textures) {
    __glGenObject(n, textures, "createTexture", GL.textures)
}

function _emscripten_glGenTransformFeedbacks(n, ids) {
    __glGenObject(n, ids, "createTransformFeedback", GL.transformFeedbacks)
}

function _emscripten_glGenVertexArrays(n, arrays) {
    __glGenObject(n, arrays, "createVertexArray", GL.vaos)
}

function _emscripten_glGenVertexArraysOES(n, arrays) {
    __glGenObject(n, arrays, "createVertexArray", GL.vaos)
}

function _emscripten_glGenerateMipmap(x0) {
    GLctx["generateMipmap"](x0)
}

function __glGetActiveAttribOrUniform(funcName, program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx[funcName](program, index);
    if (info) {
        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        if (size) HEAP32[size >> 2] = info.size;
        if (type) HEAP32[type >> 2] = info.type
    }
}

function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
    __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name)
}

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
    __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name)
}

function _emscripten_glGetActiveUniformBlockName(program, uniformBlockIndex, bufSize, length, uniformBlockName) {
    program = GL.programs[program];
    var result = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
    if (!result) return;
    if (uniformBlockName && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
}

function _emscripten_glGetActiveUniformBlockiv(program, uniformBlockIndex, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    if (pname == 35393) {
        var name = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
        HEAP32[params >> 2] = name.length + 1;
        return
    }
    var result = GLctx["getActiveUniformBlockParameter"](program, uniformBlockIndex, pname);
    if (result === null) return;
    if (pname == 35395) {
        for (var i = 0; i < result.length; i++) {
            HEAP32[params + i * 4 >> 2] = result[i]
        }
    } else {
        HEAP32[params >> 2] = result
    }
}

function _emscripten_glGetActiveUniformsiv(program, uniformCount, uniformIndices, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    if (uniformCount > 0 && uniformIndices == 0) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    var ids = [];
    for (var i = 0; i < uniformCount; i++) {
        ids.push(HEAP32[uniformIndices + i * 4 >> 2])
    }
    var result = GLctx["getActiveUniforms"](program, ids, pname);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
        HEAP32[params + i * 4 >> 2] = result[i]
    }
}

function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
    var result = GLctx.getAttachedShaders(GL.programs[program]);
    var len = result.length;
    if (len > maxCount) {
        len = maxCount
    }
    HEAP32[count >> 2] = len;
    for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[shaders + i * 4 >> 2] = id
    }
}

function _emscripten_glGetAttribLocation(program, name) {
    return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
}

function writeI53ToI64(ptr, num) {
    HEAPU32[ptr >> 2] = num;
    HEAPU32[ptr + 4 >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296
}

function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    var ret = undefined;
    switch (name_) {
        case 36346:
            ret = 1;
            break;
        case 36344:
            if (type != 0 && type != 1) {
                GL.recordError(1280)
            }
            return;
        case 34814:
        case 36345:
            ret = 0;
            break;
        case 34466:
            var formats = GLctx.getParameter(34467);
            ret = formats ? formats.length : 0;
            break;
        case 33309:
            if (GL.currentContext.version < 2) {
                GL.recordError(1282);
                return
            }
            var exts = GLctx.getSupportedExtensions() || [];
            ret = 2 * exts.length;
            break;
        case 33307:
        case 33308:
            if (GL.currentContext.version < 2) {
                GL.recordError(1280);
                return
            }
            ret = name_ == 33307 ? 3 : 0;
            break
    }
    if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
            case "number":
                ret = result;
                break;
            case "boolean":
                ret = result ? 1 : 0;
                break;
            case "string":
                GL.recordError(1280);
                return;
            case "object":
                if (result === null) {
                    switch (name_) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 36662:
                        case 36663:
                        case 35053:
                        case 35055:
                        case 36010:
                        case 35097:
                        case 35869:
                        case 32874:
                        case 36389:
                        case 35983:
                        case 35368:
                        case 34068: {
                            ret = 0;
                            break
                        }
                        default: {
                            GL.recordError(1280);
                            return
                        }
                    }
                } else if (result instanceof Float32Array || result instanceof Uint32Array ||
                    result instanceof Int32Array || result instanceof Array) {
                    for (var i = 0; i < result.length; ++i) {
                        switch (type) {
                            case 0:
                                HEAP32[p + i * 4 >> 2] = result[i];
                                break;
                            case 2:
                                HEAPF32[p + i * 4 >> 2] = result[i];
                                break;
                            case 4:
                                HEAP8[p + i >> 0] = result[i] ? 1 : 0;
                                break
                        }
                    }
                    return
                } else {
                    try {
                        ret = result.name | 0
                    } catch (e) {
                        GL.recordError(1280);
                        err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" +
                            name_ + ")! (error: " + e + ")");
                        return
                    }
                }
                break;
            default:
                GL.recordError(1280);
                err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ +
                    ") and it returns " + result + " of type " + typeof result + "!");
                return
        }
    }
    switch (type) {
        case 1:
            writeI53ToI64(p, ret);
            break;
        case 0:
            HEAP32[p >> 2] = ret;
            break;
        case 2:
            HEAPF32[p >> 2] = ret;
            break;
        case 4:
            HEAP8[p >> 0] = ret ? 1 : 0;
            break
    }
}

function _emscripten_glGetBooleanv(name_, p) {
    emscriptenWebGLGet(name_, p, 4)
}

function _emscripten_glGetBufferParameteri64v(target, value, data) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    writeI53ToI64(data, GLctx.getBufferParameter(target, value))
}

function _emscripten_glGetBufferParameteriv(target, value, data) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    HEAP32[data >> 2] = GLctx.getBufferParameter(target, value)
}

function _emscripten_glGetError() {
    var error = GLctx.getError() || GL.lastError;
    GL.lastError = 0;
    return error
}

function _emscripten_glGetFloatv(name_, p) {
    emscriptenWebGLGet(name_, p, 2)
}

function _emscripten_glGetFragDataLocation(program, name) {
    return GLctx["getFragDataLocation"](GL.programs[program], UTF8ToString(name))
}

function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
    var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
    if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
        result = result.name | 0
    }
    HEAP32[params >> 2] = result
}

function emscriptenWebGLGetIndexed(target, index, data, type) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    var result = GLctx["getIndexedParameter"](target, index);
    var ret;
    switch (typeof result) {
        case "boolean":
            ret = result ? 1 : 0;
            break;
        case "number":
            ret = result;
            break;
        case "object":
            if (result === null) {
                switch (target) {
                    case 35983:
                    case 35368:
                        ret = 0;
                        break;
                    default: {
                        GL.recordError(1280);
                        return
                    }
                }
            } else if (result instanceof WebGLBuffer) {
                ret = result.name | 0
            } else {
                GL.recordError(1280);
                return
            }
            break;
        default:
            GL.recordError(1280);
            return
    }
    switch (type) {
        case 1:
            writeI53ToI64(data, ret);
            break;
        case 0:
            HEAP32[data >> 2] = ret;
            break;
        case 2:
            HEAPF32[data >> 2] = ret;
            break;
        case 4:
            HEAP8[data >> 0] = ret ? 1 : 0;
            break;
        default:
            throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type
    }
}

function _emscripten_glGetInteger64i_v(target, index, data) {
    emscriptenWebGLGetIndexed(target, index, data, 1)
}

function _emscripten_glGetInteger64v(name_, p) {
    emscriptenWebGLGet(name_, p, 1)
}

function _emscripten_glGetIntegeri_v(target, index, data) {
    emscriptenWebGLGetIndexed(target, index, data, 0)
}

function _emscripten_glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, 0)
}

function _emscripten_glGetInternalformativ(target, internalformat, pname, bufSize, params) {
    if (bufSize < 0) {
        GL.recordError(1281);
        return
    }
    if (!params) {
        GL.recordError(1281);
        return
    }
    var ret = GLctx["getInternalformatParameter"](target, internalformat, pname);
    if (ret === null) return;
    for (var i = 0; i < ret.length && i < bufSize; ++i) {
        HEAP32[params + i * 4 >> 2] = ret[i]
    }
}

function _emscripten_glGetProgramBinary(program, bufSize, length, binaryFormat, binary) {
    GL.recordError(1282)
}

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
}

function _emscripten_glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35719) {
        if (!program.maxUniformLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
                program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name
                    .length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxUniformLength
    } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
                program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name
                    .length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxAttributeLength
    } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
                program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx
                    .getActiveUniformBlockName(program, i).length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxUniformBlockNameLength
    } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname)
    }
}

function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param;
    if (GL.currentContext.version < 2) {
        param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
    } else {
        param = GLctx["getQueryParameter"](query, pname)
    }
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    writeI53ToI64(params, ret)
}

function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    HEAP32[params >> 2] = ret
}

function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param;
    if (GL.currentContext.version < 2) {
        param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
    } else {
        param = GLctx["getQueryParameter"](query, pname)
    }
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    writeI53ToI64(params, ret)
}

function _emscripten_glGetQueryObjectuiv(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param = GLctx["getQueryParameter"](query, pname);
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    HEAP32[params >> 2] = ret
}

function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    HEAP32[params >> 2] = ret
}

function _emscripten_glGetQueryiv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx["getQuery"](target, pname)
}

function _emscripten_glGetQueryivEXT(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname)
}

function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname)
}

function _emscripten_glGetSamplerParameterfv(sampler, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAPF32[params >> 2] = GLctx["getSamplerParameter"](GL.samplers[sampler], pname)
}

function _emscripten_glGetSamplerParameteriv(sampler, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx["getSamplerParameter"](GL.samplers[sampler], pname)
}

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
}

function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
    var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
    HEAP32[range >> 2] = result.rangeMin;
    HEAP32[range + 4 >> 2] = result.rangeMax;
    HEAP32[precision >> 2] = result.precision
}

function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
    var result = GLctx.getShaderSource(GL.shaders[shader]);
    if (!result) return;
    var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
}

function _emscripten_glGetShaderiv(shader, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        var logLength = log ? log.length + 1 : 0;
        HEAP32[p >> 2] = logLength
    } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[p >> 2] = sourceLength
    } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
    }
}

function stringToNewUTF8(jsString) {
    var length = lengthBytesUTF8(jsString) + 1;
    var cString = _malloc(length);
    stringToUTF8(jsString, cString, length);
    return cString
}

function _emscripten_glGetString(name_) {
    var ret = GL.stringCache[name_];
    if (!ret) {
        switch (name_) {
            case 7939:
                var exts = GLctx.getSupportedExtensions() || [];
                exts = exts.concat(exts.map(function (e) {
                    return "GL_" + e
                }));
                ret = stringToNewUTF8(exts.join(" "));
                break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
                var s = GLctx.getParameter(name_);
                if (!s) {
                    GL.recordError(1280)
                }
                ret = s && stringToNewUTF8(s);
                break;
            case 7938:
                var glVersion = GLctx.getParameter(7938);
                if (GL.currentContext.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
                else {
                    glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
                }
                ret = stringToNewUTF8(glVersion);
                break;
            case 35724:
                var glslVersion = GLctx.getParameter(35724);
                var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                var ver_num = glslVersion.match(ver_re);
                if (ver_num !== null) {
                    if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                    glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
                }
                ret = stringToNewUTF8(glslVersion);
                break;
            default:
                GL.recordError(1280)
        }
        GL.stringCache[name_] = ret
    }
    return ret
}

function _emscripten_glGetStringi(name, index) {
    if (GL.currentContext.version < 2) {
        GL.recordError(1282);
        return 0
    }
    var stringiCache = GL.stringiCache[name];
    if (stringiCache) {
        if (index < 0 || index >= stringiCache.length) {
            GL.recordError(1281);
            return 0
        }
        return stringiCache[index]
    }
    switch (name) {
        case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(exts.map(function (e) {
                return "GL_" + e
            }));
            exts = exts.map(function (e) {
                return stringToNewUTF8(e)
            });
            stringiCache = GL.stringiCache[name] = exts;
            if (index < 0 || index >= stringiCache.length) {
                GL.recordError(1281);
                return 0
            }
            return stringiCache[index];
        default:
            GL.recordError(1280);
            return 0
    }
}

function _emscripten_glGetSynciv(sync, pname, bufSize, length, values) {
    if (bufSize < 0) {
        GL.recordError(1281);
        return
    }
    if (!values) {
        GL.recordError(1281);
        return
    }
    var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
    if (ret !== null) {
        HEAP32[values >> 2] = ret;
        if (length) HEAP32[length >> 2] = 1
    }
}

function _emscripten_glGetTexParameterfv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname)
}

function _emscripten_glGetTexParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx.getTexParameter(target, pname)
}

function _emscripten_glGetTransformFeedbackVarying(program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx["getTransformFeedbackVarying"](program, index);
    if (!info) return;
    if (name && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
    if (size) HEAP32[size >> 2] = info.size;
    if (type) HEAP32[type >> 2] = info.type
}

function _emscripten_glGetUniformBlockIndex(program, uniformBlockName) {
    return GLctx["getUniformBlockIndex"](GL.programs[program], UTF8ToString(uniformBlockName))
}

function _emscripten_glGetUniformIndices(program, uniformCount, uniformNames, uniformIndices) {
    if (!uniformIndices) {
        GL.recordError(1281);
        return
    }
    if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    var names = [];
    for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString(HEAP32[uniformNames + i * 4 >> 2]));
    var result = GLctx["getUniformIndices"](program, names);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
        HEAP32[uniformIndices + i * 4 >> 2] = result[i]
    }
}

function webglGetLeftBracePos(name) {
    return name.slice(-1) == "]" && name.lastIndexOf("[")
}

function webglPrepareUniformLocationsBeforeFirstUse(program) {
    var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i, j;
    if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
            var u = GLctx.getActiveUniform(program, i);
            var nm = u.name;
            var sz = u.size;
            var lb = webglGetLeftBracePos(nm);
            var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
            var id = program.uniformIdCounter;
            program.uniformIdCounter += sz;
            uniformSizeAndIdsByName[arrayName] = [sz, id];
            for (j = 0; j < sz; ++j) {
                uniformLocsById[id] = j;
                program.uniformArrayNamesById[id++] = arrayName
            }
        }
    }
}

function _emscripten_glGetUniformLocation(program, name) {
    name = UTF8ToString(name);
    if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
            arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
            uniformBaseName = name.slice(0, leftBrace)
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
            arrayIndex += sizeAndId[1];
            if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
                return arrayIndex
            }
        }
    } else {
        GL.recordError(1281)
    }
    return -1
}

function webglGetUniformLocation(location) {
    var p = GLctx.currentProgram;
    if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == "number") {
            p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (
                webglLoc > 0 ? "[" + webglLoc + "]" : ""))
        }
        return webglLoc
    } else {
        GL.recordError(1282)
    }
}

function emscriptenWebGLGetUniform(program, location, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var data = GLctx.getUniform(program, webglGetUniformLocation(location));
    if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case 0:
                HEAP32[params >> 2] = data;
                break;
            case 2:
                HEAPF32[params >> 2] = data;
                break
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case 0:
                    HEAP32[params + i * 4 >> 2] = data[i];
                    break;
                case 2:
                    HEAPF32[params + i * 4 >> 2] = data[i];
                    break
            }
        }
    }
}

function _emscripten_glGetUniformfv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 2)
}

function _emscripten_glGetUniformiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 0)
}

function _emscripten_glGetUniformuiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 0)
}

function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    if (GL.currentContext.clientBuffers[index].enabled) {
        err("glGetVertexAttrib*v on client-side array: not supported, bad data returned")
    }
    var data = GLctx.getVertexAttrib(index, pname);
    if (pname == 34975) {
        HEAP32[params >> 2] = data && data["name"]
    } else if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case 0:
                HEAP32[params >> 2] = data;
                break;
            case 2:
                HEAPF32[params >> 2] = data;
                break;
            case 5:
                HEAP32[params >> 2] = Math.fround(data);
                break
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case 0:
                    HEAP32[params + i * 4 >> 2] = data[i];
                    break;
                case 2:
                    HEAPF32[params + i * 4 >> 2] = data[i];
                    break;
                case 5:
                    HEAP32[params + i * 4 >> 2] = Math.fround(data[i]);
                    break
            }
        }
    }
}

function _emscripten_glGetVertexAttribIiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
}

function _emscripten_glGetVertexAttribIuiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
}

function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
    if (!pointer) {
        GL.recordError(1281);
        return
    }
    if (GL.currentContext.clientBuffers[index].enabled) {
        err("glGetVertexAttribPointer on client-side array: not supported, bad data returned")
    }
    HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname)
}

function _emscripten_glGetVertexAttribfv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 2)
}

function _emscripten_glGetVertexAttribiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 5)
}

function _emscripten_glHint(x0, x1) {
    GLctx["hint"](x0, x1)
}

function _emscripten_glInvalidateFramebuffer(target, numAttachments, attachments) {
    var list = tempFixedLengthArray[numAttachments];
    for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[attachments + i * 4 >> 2]
    }
    GLctx["invalidateFramebuffer"](target, list)
}

function _emscripten_glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
    var list = tempFixedLengthArray[numAttachments];
    for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[attachments + i * 4 >> 2]
    }
    GLctx["invalidateSubFramebuffer"](target, list, x, y, width, height)
}

function _emscripten_glIsBuffer(buffer) {
    var b = GL.buffers[buffer];
    if (!b) return 0;
    return GLctx.isBuffer(b)
}

function _emscripten_glIsEnabled(x0) {
    return GLctx["isEnabled"](x0)
}

function _emscripten_glIsFramebuffer(framebuffer) {
    var fb = GL.framebuffers[framebuffer];
    if (!fb) return 0;
    return GLctx.isFramebuffer(fb)
}

function _emscripten_glIsProgram(program) {
    program = GL.programs[program];
    if (!program) return 0;
    return GLctx.isProgram(program)
}

function _emscripten_glIsQuery(id) {
    var query = GL.queries[id];
    if (!query) return 0;
    return GLctx["isQuery"](query)
}

function _emscripten_glIsQueryEXT(id) {
    var query = GL.queries[id];
    if (!query) return 0;
    return GLctx.disjointTimerQueryExt["isQueryEXT"](query)
}

function _emscripten_glIsRenderbuffer(renderbuffer) {
    var rb = GL.renderbuffers[renderbuffer];
    if (!rb) return 0;
    return GLctx.isRenderbuffer(rb)
}

function _emscripten_glIsSampler(id) {
    var sampler = GL.samplers[id];
    if (!sampler) return 0;
    return GLctx["isSampler"](sampler)
}

function _emscripten_glIsShader(shader) {
    var s = GL.shaders[shader];
    if (!s) return 0;
    return GLctx.isShader(s)
}

function _emscripten_glIsSync(sync) {
    return GLctx.isSync(GL.syncs[sync])
}

function _emscripten_glIsTexture(id) {
    var texture = GL.textures[id];
    if (!texture) return 0;
    return GLctx.isTexture(texture)
}

function _emscripten_glIsTransformFeedback(id) {
    return GLctx["isTransformFeedback"](GL.transformFeedbacks[id])
}

function _emscripten_glIsVertexArray(array) {
    var vao = GL.vaos[array];
    if (!vao) return 0;
    return GLctx["isVertexArray"](vao)
}

function _emscripten_glIsVertexArrayOES(array) {
    var vao = GL.vaos[array];
    if (!vao) return 0;
    return GLctx["isVertexArray"](vao)
}

function _emscripten_glLineWidth(x0) {
    GLctx["lineWidth"](x0)
}

function _emscripten_glLinkProgram(program) {
    program = GL.programs[program];
    GLctx.linkProgram(program);
    program.uniformLocsById = 0;
    program.uniformSizeAndIdsByName = {}
}

function _emscripten_glPauseTransformFeedback() {
    GLctx["pauseTransformFeedback"]()
}

function _emscripten_glPixelStorei(pname, param) {
    if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}

function _emscripten_glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1)
}

function _emscripten_glProgramBinary(program, binaryFormat, binary, length) {
    GL.recordError(1280)
}

function _emscripten_glProgramParameteri(program, pname, value) {
    GL.recordError(1280)
}

function _emscripten_glQueryCounterEXT(id, target) {
    GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target)
}

function _emscripten_glReadBuffer(x0) {
    GLctx["readBuffer"](x0)
}

function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
    function roundedToNextMultipleOf(x, y) {
        return x + y - 1 & -y
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height * alignedRowSize
}

function __colorChannelsInGlTextureFormat(format) {
    var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
    };
    return colorChannels[format - 6402] || 1
}

function heapObjectForWebGLType(type) {
    type -= 5120;
    if (type == 0) return HEAP8;
    if (type == 1) return HEAPU8;
    if (type == 2) return HEAP16;
    if (type == 4) return HEAP32;
    if (type == 6) return HEAPF32;
    if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32;
    return HEAPU16
}

function heapAccessShiftForWebGLHeap(heap) {
    return 31 - Math.clz32(heap.BYTES_PER_ELEMENT)
}

function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
    var heap = heapObjectForWebGLType(type);
    var shift = heapAccessShiftForWebGLHeap(heap);
    var byteSize = 1 << shift;
    var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
    var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
    return heap.subarray(pixels >> shift, pixels + bytes >> shift)
}

function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelPackBufferBinding) {
            GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
            var heap = heapObjectForWebGLType(type);
            GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        }
        return
    }
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}

function _emscripten_glReleaseShaderCompiler() {}

function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3)
}

function _emscripten_glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
    GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4)
}

function _emscripten_glResumeTransformFeedback() {
    GLctx["resumeTransformFeedback"]()
}

function _emscripten_glSampleCoverage(value, invert) {
    GLctx.sampleCoverage(value, !!invert)
}

function _emscripten_glSamplerParameterf(sampler, pname, param) {
    GLctx["samplerParameterf"](GL.samplers[sampler], pname, param)
}

function _emscripten_glSamplerParameterfv(sampler, pname, params) {
    var param = HEAPF32[params >> 2];
    GLctx["samplerParameterf"](GL.samplers[sampler], pname, param)
}

function _emscripten_glSamplerParameteri(sampler, pname, param) {
    GLctx["samplerParameteri"](GL.samplers[sampler], pname, param)
}

function _emscripten_glSamplerParameteriv(sampler, pname, params) {
    var param = HEAP32[params >> 2];
    GLctx["samplerParameteri"](GL.samplers[sampler], pname, param)
}

function _emscripten_glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3)
}

function _emscripten_glShaderBinary() {
    GL.recordError(1280)
}

function _emscripten_glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    GLctx.shaderSource(GL.shaders[shader], source)
}

function _emscripten_glStencilFunc(x0, x1, x2) {
    GLctx["stencilFunc"](x0, x1, x2)
}

function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx["stencilFuncSeparate"](x0, x1, x2, x3)
}

function _emscripten_glStencilMask(x0) {
    GLctx["stencilMask"](x0)
}

function _emscripten_glStencilMaskSeparate(x0, x1) {
    GLctx["stencilMaskSeparate"](x0, x1)
}

function _emscripten_glStencilOp(x0, x1, x2) {
    GLctx["stencilOp"](x0, x1, x2)
}

function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3)
}

function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >>
                heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null)
        }
        return
    }
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ?
        emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null)
}

function _emscripten_glTexImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["texImage3D"](target, level, internalFormat, width, height, depth, border, format, type, pixels)
    } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx["texImage3D"](target, level, internalFormat, width, height, depth, border, format, type, heap, pixels >>
            heapAccessShiftForWebGLHeap(heap))
    } else {
        GLctx["texImage3D"](target, level, internalFormat, width, height, depth, border, format, type, null)
    }
}

function _emscripten_glTexParameterf(x0, x1, x2) {
    GLctx["texParameterf"](x0, x1, x2)
}

function _emscripten_glTexParameterfv(target, pname, params) {
    var param = HEAPF32[params >> 2];
    GLctx.texParameterf(target, pname, param)
}

function _emscripten_glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2)
}

function _emscripten_glTexParameteriv(target, pname, params) {
    var param = HEAP32[params >> 2];
    GLctx.texParameteri(target, pname, param)
}

function _emscripten_glTexStorage2D(x0, x1, x2, x3, x4) {
    GLctx["texStorage2D"](x0, x1, x2, x3, x4)
}

function _emscripten_glTexStorage3D(x0, x1, x2, x3, x4, x5) {
    GLctx["texStorage3D"](x0, x1, x2, x3, x4, x5)
}

function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >>
                heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}

function _emscripten_glTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type,
    pixels) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["texSubImage3D"](target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels)
    } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx["texSubImage3D"](target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap,
            pixels >> heapAccessShiftForWebGLHeap(heap))
    } else {
        GLctx["texSubImage3D"](target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null)
    }
}

function _emscripten_glTransformFeedbackVaryings(program, count, varyings, bufferMode) {
    program = GL.programs[program];
    var vars = [];
    for (var i = 0; i < count; i++) vars.push(UTF8ToString(HEAP32[varyings + i * 4 >> 2]));
    GLctx["transformFeedbackVaryings"](program, vars, bufferMode)
}

function _emscripten_glUniform1f(location, v0) {
    GLctx.uniform1f(webglGetUniformLocation(location), v0)
}
var miniTempWebGLFloatBuffers = [];

function _emscripten_glUniform1fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform1fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count);
        return
    }
    if (count <= 288) {
        var view = miniTempWebGLFloatBuffers[count - 1];
        for (var i = 0; i < count; ++i) {
            view[i] = HEAPF32[value + 4 * i >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2)
    }
    GLctx.uniform1fv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform1i(location, v0) {
    GLctx.uniform1i(webglGetUniformLocation(location), v0)
}
var __miniTempWebGLIntBuffers = [];

function _emscripten_glUniform1iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform1iv(webglGetUniformLocation(location), HEAP32, value >> 2, count);
        return
    }
    if (count <= 288) {
        var view = __miniTempWebGLIntBuffers[count - 1];
        for (var i = 0; i < count; ++i) {
            view[i] = HEAP32[value + 4 * i >> 2]
        }
    } else {
        var view = HEAP32.subarray(value >> 2, value + count * 4 >> 2)
    }
    GLctx.uniform1iv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform1ui(location, v0) {
    GLctx.uniform1ui(webglGetUniformLocation(location), v0)
}

function _emscripten_glUniform1uiv(location, count, value) {
    count && GLctx.uniform1uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count)
}

function _emscripten_glUniform2f(location, v0, v1) {
    GLctx.uniform2f(webglGetUniformLocation(location), v0, v1)
}

function _emscripten_glUniform2fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform2fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 2);
        return
    }
    if (count <= 144) {
        var view = miniTempWebGLFloatBuffers[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2)
    }
    GLctx.uniform2fv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform2i(location, v0, v1) {
    GLctx.uniform2i(webglGetUniformLocation(location), v0, v1)
}

function _emscripten_glUniform2iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform2iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 2);
        return
    }
    if (count <= 144) {
        var view = __miniTempWebGLIntBuffers[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
            view[i] = HEAP32[value + 4 * i >> 2];
            view[i + 1] = HEAP32[value + (4 * i + 4) >> 2]
        }
    } else {
        var view = HEAP32.subarray(value >> 2, value + count * 8 >> 2)
    }
    GLctx.uniform2iv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform2ui(location, v0, v1) {
    GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1)
}

function _emscripten_glUniform2uiv(location, count, value) {
    count && GLctx.uniform2uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 2)
}

function _emscripten_glUniform3f(location, v0, v1, v2) {
    GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2)
}

function _emscripten_glUniform3fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform3fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 3);
        return
    }
    if (count <= 96) {
        var view = miniTempWebGLFloatBuffers[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2)
    }
    GLctx.uniform3fv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform3i(location, v0, v1, v2) {
    GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2)
}

function _emscripten_glUniform3iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform3iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 3);
        return
    }
    if (count <= 96) {
        var view = __miniTempWebGLIntBuffers[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
            view[i] = HEAP32[value + 4 * i >> 2];
            view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAP32[value + (4 * i + 8) >> 2]
        }
    } else {
        var view = HEAP32.subarray(value >> 2, value + count * 12 >> 2)
    }
    GLctx.uniform3iv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform3ui(location, v0, v1, v2) {
    GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2)
}

function _emscripten_glUniform3uiv(location, count, value) {
    count && GLctx.uniform3uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 3)
}

function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
    GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3)
}

function _emscripten_glUniform4fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 4);
        return
    }
    if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1];
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 4 * count; i += 4) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4fv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
    GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3)
}

function _emscripten_glUniform4iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniform4iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 4);
        return
    }
    if (count <= 72) {
        var view = __miniTempWebGLIntBuffers[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAP32[value + 4 * i >> 2];
            view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAP32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAP32[value + (4 * i + 12) >> 2]
        }
    } else {
        var view = HEAP32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4iv(webglGetUniformLocation(location), view)
}

function _emscripten_glUniform4ui(location, v0, v1, v2, v3) {
    GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3)
}

function _emscripten_glUniform4uiv(location, count, value) {
    count && GLctx.uniform4uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 4)
}

function _emscripten_glUniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding) {
    program = GL.programs[program];
    GLctx["uniformBlockBinding"](program, uniformBlockIndex, uniformBlockBinding)
}

function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 4);
        return
    }
    if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view)
}

function _emscripten_glUniformMatrix2x3fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
}

function _emscripten_glUniformMatrix2x4fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
}

function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 9);
        return
    }
    if (count <= 32) {
        var view = miniTempWebGLFloatBuffers[9 * count - 1];
        for (var i = 0; i < 9 * count; i += 9) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2)
    }
    GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view)
}

function _emscripten_glUniformMatrix3x2fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
}

function _emscripten_glUniformMatrix3x4fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
}

function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count *
        16);
        return
    }
    if (count <= 18) {
        var view = miniTempWebGLFloatBuffers[16 * count - 1];
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 16 * count; i += 16) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3];
            view[i + 4] = heap[dst + 4];
            view[i + 5] = heap[dst + 5];
            view[i + 6] = heap[dst + 6];
            view[i + 7] = heap[dst + 7];
            view[i + 8] = heap[dst + 8];
            view[i + 9] = heap[dst + 9];
            view[i + 10] = heap[dst + 10];
            view[i + 11] = heap[dst + 11];
            view[i + 12] = heap[dst + 12];
            view[i + 13] = heap[dst + 13];
            view[i + 14] = heap[dst + 14];
            view[i + 15] = heap[dst + 15]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2)
    }
    GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view)
}

function _emscripten_glUniformMatrix4x2fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
}

function _emscripten_glUniformMatrix4x3fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
}

function _emscripten_glUseProgram(program) {
    program = GL.programs[program];
    GLctx.useProgram(program);
    GLctx.currentProgram = program
}

function _emscripten_glValidateProgram(program) {
    GLctx.validateProgram(GL.programs[program])
}

function _emscripten_glVertexAttrib1f(x0, x1) {
    GLctx["vertexAttrib1f"](x0, x1)
}

function _emscripten_glVertexAttrib1fv(index, v) {
    GLctx.vertexAttrib1f(index, HEAPF32[v >> 2])
}

function _emscripten_glVertexAttrib2f(x0, x1, x2) {
    GLctx["vertexAttrib2f"](x0, x1, x2)
}

function _emscripten_glVertexAttrib2fv(index, v) {
    GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2])
}

function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
    GLctx["vertexAttrib3f"](x0, x1, x2, x3)
}

function _emscripten_glVertexAttrib3fv(index, v) {
    GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2])
}

function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
    GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4)
}

function _emscripten_glVertexAttrib4fv(index, v) {
    GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2])
}

function _emscripten_glVertexAttribDivisor(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glVertexAttribDivisorARB(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glVertexAttribDivisorEXT(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glVertexAttribDivisorNV(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glVertexAttribI4i(x0, x1, x2, x3, x4) {
    GLctx["vertexAttribI4i"](x0, x1, x2, x3, x4)
}

function _emscripten_glVertexAttribI4iv(index, v) {
    GLctx.vertexAttribI4i(index, HEAP32[v >> 2], HEAP32[v + 4 >> 2], HEAP32[v + 8 >> 2], HEAP32[v + 12 >> 2])
}

function _emscripten_glVertexAttribI4ui(x0, x1, x2, x3, x4) {
    GLctx["vertexAttribI4ui"](x0, x1, x2, x3, x4)
}

function _emscripten_glVertexAttribI4uiv(index, v) {
    GLctx.vertexAttribI4ui(index, HEAPU32[v >> 2], HEAPU32[v + 4 >> 2], HEAPU32[v + 8 >> 2], HEAPU32[v + 12 >> 2])
}

function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) {
    GLctx["vertexAttribIPointer"](index, size, type, stride, ptr)
}

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    var cb = GL.currentContext.clientBuffers[index];
    if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = normalized;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function (index, size, type, normalized, stride, ptr) {
            this.vertexAttribPointer(index, size, type, normalized, stride, ptr)
        };
        return
    }
    cb.clientside = false;
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}

function _emscripten_glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3)
}

function _emscripten_glWaitSync(sync, flags, timeoutLo, timeoutHi) {
    GLctx.waitSync(GL.syncs[sync], flags, convertI32PairToI53(timeoutLo, timeoutHi))
}

function _emscripten_has_asyncify() {
    return 1
}

function reallyNegative(x) {
    return x < 0 || x === 0 && 1 / x === -Infinity
}

function convertU32PairToI53(lo, hi) {
    return (lo >>> 0) + (hi >>> 0) * 4294967296
}

function reSign(value, bits) {
    if (value <= 0) {
        return value
    }
    var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
    if (value >= half && (bits <= 32 || value > half)) {
        value = -2 * half + value
    }
    return value
}

function unSign(value, bits) {
    if (value >= 0) {
        return value
    }
    return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value
}

function strLen(ptr) {
    var end = ptr;
    while (HEAPU8[end]) ++end;
    return end - ptr
}

function formatString(format, varargs) {
    var textIndex = format;
    var argIndex = varargs;

    function prepVararg(ptr, type) {
        if (type === "double" || type === "i64") {
            if (ptr & 7) {
                ptr += 4
            }
        } else {}
        return ptr
    }

    function getNextArg(type) {
        var ret;
        argIndex = prepVararg(argIndex, type);
        if (type === "double") {
            ret = HEAPF64[argIndex >> 3];
            argIndex += 8
        } else if (type == "i64") {
            ret = [HEAP32[argIndex >> 2], HEAP32[argIndex + 4 >> 2]];
            argIndex += 8
        } else {
            type = "i32";
            ret = HEAP32[argIndex >> 2];
            argIndex += 4
        }
        return ret
    }
    var ret = [];
    var curr, next, currArg;
    while (1) {
        var startTextIndex = textIndex;
        curr = HEAP8[textIndex >> 0];
        if (curr === 0) break;
        next = HEAP8[textIndex + 1 >> 0];
        if (curr == 37) {
            var flagAlwaysSigned = false;
            var flagLeftAlign = false;
            var flagAlternative = false;
            var flagZeroPad = false;
            var flagPadSign = false;
            flagsLoop: while (1) {
                switch (next) {
                    case 43:
                        flagAlwaysSigned = true;
                        break;
                    case 45:
                        flagLeftAlign = true;
                        break;
                    case 35:
                        flagAlternative = true;
                        break;
                    case 48:
                        if (flagZeroPad) {
                            break flagsLoop
                        } else {
                            flagZeroPad = true;
                            break
                        }
                    case 32:
                        flagPadSign = true;
                        break;
                    default:
                        break flagsLoop
                }
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0]
            }
            var width = 0;
            if (next == 42) {
                width = getNextArg("i32");
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0]
            } else {
                while (next >= 48 && next <= 57) {
                    width = width * 10 + (next - 48);
                    textIndex++;
                    next = HEAP8[textIndex + 1 >> 0]
                }
            }
            var precisionSet = false,
                precision = -1;
            if (next == 46) {
                precision = 0;
                precisionSet = true;
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0];
                if (next == 42) {
                    precision = getNextArg("i32");
                    textIndex++
                } else {
                    while (1) {
                        var precisionChr = HEAP8[textIndex + 1 >> 0];
                        if (precisionChr < 48 || precisionChr > 57) break;
                        precision = precision * 10 + (precisionChr - 48);
                        textIndex++
                    }
                }
                next = HEAP8[textIndex + 1 >> 0]
            }
            if (precision < 0) {
                precision = 6;
                precisionSet = false
            }
            var argSize;
            switch (String.fromCharCode(next)) {
                case "h":
                    var nextNext = HEAP8[textIndex + 2 >> 0];
                    if (nextNext == 104) {
                        textIndex++;
                        argSize = 1
                    } else {
                        argSize = 2
                    }
                    break;
                case "l":
                    var nextNext = HEAP8[textIndex + 2 >> 0];
                    if (nextNext == 108) {
                        textIndex++;
                        argSize = 8
                    } else {
                        argSize = 4
                    }
                    break;
                case "L":
                case "q":
                case "j":
                    argSize = 8;
                    break;
                case "z":
                case "t":
                case "I":
                    argSize = 4;
                    break;
                default:
                    argSize = null
            }
            if (argSize) textIndex++;
            next = HEAP8[textIndex + 1 >> 0];
            switch (String.fromCharCode(next)) {
                case "d":
                case "i":
                case "u":
                case "o":
                case "x":
                case "X":
                case "p": {
                    var signed = next == 100 || next == 105;
                    argSize = argSize || 4;
                    currArg = getNextArg("i" + argSize * 8);
                    var argText;
                    if (argSize == 8) {
                        currArg = next == 117 ? convertU32PairToI53(currArg[0], currArg[1]) : convertI32PairToI53(
                            currArg[0], currArg[1])
                    }
                    if (argSize <= 4) {
                        var limit = Math.pow(256, argSize) - 1;
                        currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8)
                    }
                    var currAbsArg = Math.abs(currArg);
                    var prefix = "";
                    if (next == 100 || next == 105) {
                        argText = reSign(currArg, 8 * argSize).toString(10)
                    } else if (next == 117) {
                        argText = unSign(currArg, 8 * argSize).toString(10);
                        currArg = Math.abs(currArg)
                    } else if (next == 111) {
                        argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8)
                    } else if (next == 120 || next == 88) {
                        prefix = flagAlternative && currArg != 0 ? "0x" : "";
                        if (currArg < 0) {
                            currArg = -currArg;
                            argText = (currAbsArg - 1).toString(16);
                            var buffer = [];
                            for (var i = 0; i < argText.length; i++) {
                                buffer.push((15 - parseInt(argText[i], 16)).toString(16))
                            }
                            argText = buffer.join("");
                            while (argText.length < argSize * 2) argText = "f" + argText
                        } else {
                            argText = currAbsArg.toString(16)
                        }
                        if (next == 88) {
                            prefix = prefix.toUpperCase();
                            argText = argText.toUpperCase()
                        }
                    } else if (next == 112) {
                        if (currAbsArg === 0) {
                            argText = "(nil)"
                        } else {
                            prefix = "0x";
                            argText = currAbsArg.toString(16)
                        }
                    }
                    if (precisionSet) {
                        while (argText.length < precision) {
                            argText = "0" + argText
                        }
                    }
                    if (currArg >= 0) {
                        if (flagAlwaysSigned) {
                            prefix = "+" + prefix
                        } else if (flagPadSign) {
                            prefix = " " + prefix
                        }
                    }
                    if (argText.charAt(0) == "-") {
                        prefix = "-" + prefix;
                        argText = argText.substr(1)
                    }
                    while (prefix.length + argText.length < width) {
                        if (flagLeftAlign) {
                            argText += " "
                        } else {
                            if (flagZeroPad) {
                                argText = "0" + argText
                            } else {
                                prefix = " " + prefix
                            }
                        }
                    }
                    argText = prefix + argText;
                    argText.split("").forEach(function (chr) {
                        ret.push(chr.charCodeAt(0))
                    });
                    break
                }
                case "f":
                case "F":
                case "e":
                case "E":
                case "g":
                case "G": {
                    currArg = getNextArg("double");
                    var argText;
                    if (isNaN(currArg)) {
                        argText = "nan";
                        flagZeroPad = false
                    } else if (!isFinite(currArg)) {
                        argText = (currArg < 0 ? "-" : "") + "inf";
                        flagZeroPad = false
                    } else {
                        var isGeneral = false;
                        var effectivePrecision = Math.min(precision, 20);
                        if (next == 103 || next == 71) {
                            isGeneral = true;
                            precision = precision || 1;
                            var exponent = parseInt(currArg.toExponential(effectivePrecision).split("e")[1], 10);
                            if (precision > exponent && exponent >= -4) {
                                next = (next == 103 ? "f" : "F").charCodeAt(0);
                                precision -= exponent + 1
                            } else {
                                next = (next == 103 ? "e" : "E").charCodeAt(0);
                                precision--
                            }
                            effectivePrecision = Math.min(precision, 20)
                        }
                        if (next == 101 || next == 69) {
                            argText = currArg.toExponential(effectivePrecision);
                            if (/[eE][-+]\d$/.test(argText)) {
                                argText = argText.slice(0, -1) + "0" + argText.slice(-1)
                            }
                        } else if (next == 102 || next == 70) {
                            argText = currArg.toFixed(effectivePrecision);
                            if (currArg === 0 && reallyNegative(currArg)) {
                                argText = "-" + argText
                            }
                        }
                        var parts = argText.split("e");
                        if (isGeneral && !flagAlternative) {
                            while (parts[0].length > 1 && parts[0].includes(".") && (parts[0].slice(-1) == "0" || parts[
                                    0].slice(-1) == ".")) {
                                parts[0] = parts[0].slice(0, -1)
                            }
                        } else {
                            if (flagAlternative && argText.indexOf(".") == -1) parts[0] += ".";
                            while (precision > effectivePrecision++) parts[0] += "0"
                        }
                        argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
                        if (next == 69) argText = argText.toUpperCase();
                        if (currArg >= 0) {
                            if (flagAlwaysSigned) {
                                argText = "+" + argText
                            } else if (flagPadSign) {
                                argText = " " + argText
                            }
                        }
                    }
                    while (argText.length < width) {
                        if (flagLeftAlign) {
                            argText += " "
                        } else {
                            if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
                                argText = argText[0] + "0" + argText.slice(1)
                            } else {
                                argText = (flagZeroPad ? "0" : " ") + argText
                            }
                        }
                    }
                    if (next < 97) argText = argText.toUpperCase();
                    argText.split("").forEach(function (chr) {
                        ret.push(chr.charCodeAt(0))
                    });
                    break
                }
                case "s": {
                    var arg = getNextArg("i8*");
                    var argLength = arg ? strLen(arg) : "(null)".length;
                    if (precisionSet) argLength = Math.min(argLength, precision);
                    if (!flagLeftAlign) {
                        while (argLength < width--) {
                            ret.push(32)
                        }
                    }
                    if (arg) {
                        for (var i = 0; i < argLength; i++) {
                            ret.push(HEAPU8[arg++ >> 0])
                        }
                    } else {
                        ret = ret.concat(intArrayFromString("(null)".substr(0, argLength), true))
                    }
                    if (flagLeftAlign) {
                        while (argLength < width--) {
                            ret.push(32)
                        }
                    }
                    break
                }
                case "c": {
                    if (flagLeftAlign) ret.push(getNextArg("i8"));
                    while (--width > 0) {
                        ret.push(32)
                    }
                    if (!flagLeftAlign) ret.push(getNextArg("i8"));
                    break
                }
                case "n": {
                    var ptr = getNextArg("i32*");
                    HEAP32[ptr >> 2] = ret.length;
                    break
                }
                case "%": {
                    ret.push(curr);
                    break
                }
                default: {
                    for (var i = startTextIndex; i < textIndex + 2; i++) {
                        ret.push(HEAP8[i >> 0])
                    }
                }
            }
            textIndex += 2
        } else {
            ret.push(curr);
            textIndex += 1
        }
    }
    return ret
}

function _emscripten_log_js(flags, str) {
    if (flags & 24) {
        str = str.replace(/\s+$/, "");
        str += (str.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(flags)
    }
    if (flags & 1) {
        if (flags & 4) {
            console.error(str)
        } else if (flags & 2) {
            console.warn(str)
        } else if (flags & 512) {
            console.info(str)
        } else if (flags & 256) {
            console.debug(str)
        } else {
            console.log(str)
        }
    } else if (flags & 6) {
        err(str)
    } else {
        out(str)
    }
}

function _emscripten_log(flags, format, varargs) {
    var result = formatString(format, varargs);
    var str = UTF8ArrayToString(result, 0);
    _emscripten_log_js(flags, str)
}

function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num)
}

function doRequestFullscreen(target, strategy) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
        return -3
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (strategy.deferUntilInEventHandler) {
            JSEvents.deferCall(JSEvents_requestFullscreen, 1, [target, strategy]);
            return 1
        }
        return -2
    }
    return JSEvents_requestFullscreen(target, strategy)
}

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
    var strategy = {
        scaleMode: HEAP32[fullscreenStrategy >> 2],
        canvasResolutionScaleMode: HEAP32[fullscreenStrategy + 4 >> 2],
        filteringMode: HEAP32[fullscreenStrategy + 8 >> 2],
        deferUntilInEventHandler: deferUntilInEventHandler,
        canvasResizedCallback: HEAP32[fullscreenStrategy + 12 >> 2],
        canvasResizedCallbackUserData: HEAP32[fullscreenStrategy + 16 >> 2]
    };
    return doRequestFullscreen(target, strategy)
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestPointerLock && !target.msRequestPointerLock) {
        return -1
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (deferUntilInEventHandler) {
            JSEvents.deferCall(requestPointerLock, 2, [target]);
            return 1
        }
        return -2
    }
    return requestPointerLock(target)
}

function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1
    } catch (e) {}
}

function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
        return false
    }
    let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
            return true
        }
    }
    return false
}

function _emscripten_run_script(ptr) {
    eval(UTF8ToString(ptr))
}

function _emscripten_run_script_int(ptr) {
    return eval(UTF8ToString(ptr)) | 0
}

function _emscripten_run_script_string(ptr) {
    var s = eval(UTF8ToString(ptr));
    if (s == null) {
        return 0
    }
    s += "";
    var me = _emscripten_run_script_string;
    var len = lengthBytesUTF8(s);
    if (!me.bufferSize || me.bufferSize < len + 1) {
        if (me.bufferSize) _free(me.buffer);
        me.bufferSize = len + 1;
        me.buffer = _malloc(me.bufferSize)
    }
    stringToUTF8(s, me.buffer, me.bufferSize);
    return me.buffer
}

function _emscripten_sample_gamepad_data() {
    return (JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ?
        navigator.webkitGetGamepads() : null) ? 0 : -1
}

function registerBeforeUnloadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
    var beforeUnloadEventHandlerFunc = function (ev) {
        var e = ev || event;
        var confirmationMessage = function (a1, a2, a3) {
            return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
        }(eventTypeId, 0, userData);
        if (confirmationMessage) {
            confirmationMessage = UTF8ToString(confirmationMessage)
        }
        if (confirmationMessage) {
            e.preventDefault();
            e.returnValue = confirmationMessage;
            return confirmationMessage
        }
    };
    var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: beforeUnloadEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
    if (typeof onbeforeunload == "undefined") return -1;
    if (targetThread !== 1) return -5;
    registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
    return 0
}

function registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
    var focusEventHandlerFunc = function (ev) {
        var e = ev || event;
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ? e.target.id : "";
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, focusEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: focusEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
    return 0
}

function _emscripten_set_element_css_size(target, width, height) {
    target = findEventTarget(target);
    if (!target) return -4;
    target.style.width = width + "px";
    target.style.height = height + "px";
    return 0
}

function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
    return 0
}

function fillFullscreenChangeEventData(eventStruct) {
    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document
        .webkitFullscreenElement || document.msFullscreenElement;
    var isFullscreen = !!fullscreenElement;
    HEAP32[eventStruct >> 2] = isFullscreen;
    HEAP32[eventStruct + 4 >> 2] = JSEvents.fullscreenEnabled();
    var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
    var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
    var id = reportedElement && reportedElement.id ? reportedElement.id : "";
    stringToUTF8(nodeName, eventStruct + 8, 128);
    stringToUTF8(id, eventStruct + 136, 128);
    HEAP32[eventStruct + 264 >> 2] = reportedElement ? reportedElement.clientWidth : 0;
    HEAP32[eventStruct + 268 >> 2] = reportedElement ? reportedElement.clientHeight : 0;
    HEAP32[eventStruct + 272 >> 2] = screen.width;
    HEAP32[eventStruct + 276 >> 2] = screen.height;
    if (isFullscreen) {
        JSEvents.previousFullscreenElement = fullscreenElement
    }
}

function registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc(280);
    var fullscreenChangeEventhandlerFunc = function (ev) {
        var e = ev || event;
        var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
        fillFullscreenChangeEventData(fullscreenChangeEvent);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: fullscreenChangeEventhandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange",
        targetThread);
    registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange",
        targetThread);
    return 0
}

function registerGamepadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);
    var gamepadEventHandlerFunc = function (ev) {
        var e = ev || event;
        var gamepadEvent = JSEvents.gamepadEvent;
        fillGamepadEventData(gamepadEvent, e["gamepad"]);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, gamepadEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: gamepadEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
    return 0
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
    return 0
}

function registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(176);
    var keyEventHandlerFunc = function (e) {
        var keyEventData = JSEvents.keyEvent;
        HEAPF64[keyEventData >> 3] = e.timeStamp;
        var idx = keyEventData >> 2;
        HEAP32[idx + 2] = e.location;
        HEAP32[idx + 3] = e.ctrlKey;
        HEAP32[idx + 4] = e.shiftKey;
        HEAP32[idx + 5] = e.altKey;
        HEAP32[idx + 6] = e.metaKey;
        HEAP32[idx + 7] = e.repeat;
        HEAP32[idx + 8] = e.charCode;
        HEAP32[idx + 9] = e.keyCode;
        HEAP32[idx + 10] = e.which;
        stringToUTF8(e.key || "", keyEventData + 44, 32);
        stringToUTF8(e.code || "", keyEventData + 76, 32);
        stringToUTF8(e.char || "", keyEventData + 108, 32);
        stringToUTF8(e.locale || "", keyEventData + 140, 32);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, keyEventData, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
    return 0
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
    return 0
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
    return 0
}

function _emscripten_set_main_loop_arg(func, arg, fps, simulateInfiniteLoop) {
    var browserIterationFunc = () => (function (a1) {
        dynCall_vi.apply(null, [func, a1])
    })(arg);
    setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg)
}

function fillMouseEventData(eventStruct, e, target) {
    HEAPF64[eventStruct >> 3] = e.timeStamp;
    var idx = eventStruct >> 2;
    HEAP32[idx + 2] = e.screenX;
    HEAP32[idx + 3] = e.screenY;
    HEAP32[idx + 4] = e.clientX;
    HEAP32[idx + 5] = e.clientY;
    HEAP32[idx + 6] = e.ctrlKey;
    HEAP32[idx + 7] = e.shiftKey;
    HEAP32[idx + 8] = e.altKey;
    HEAP32[idx + 9] = e.metaKey;
    HEAP16[idx * 2 + 20] = e.button;
    HEAP16[idx * 2 + 21] = e.buttons;
    HEAP32[idx + 11] = e["movementX"];
    HEAP32[idx + 12] = e["movementY"];
    var rect = getBoundingClientRect(target);
    HEAP32[idx + 13] = e.clientX - rect.left;
    HEAP32[idx + 14] = e.clientY - rect.top
}

function registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
    target = findEventTarget(target);
    var mouseEventHandlerFunc = function (ev) {
        var e = ev || event;
        fillMouseEventData(JSEvents.mouseEvent, e, target);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString !=
            "mouseleave",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
    return 0
}

function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
    return 0
}

function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
    return 0
}

function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
    return 0
}

function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
    return 0
}

function fillPointerlockChangeEventData(eventStruct) {
    var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document
        .webkitPointerLockElement || document.msPointerLockElement;
    var isPointerlocked = !!pointerLockElement;
    HEAP32[eventStruct >> 2] = isPointerlocked;
    var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
    var id = pointerLockElement && pointerLockElement.id ? pointerLockElement.id : "";
    stringToUTF8(nodeName, eventStruct + 4, 128);
    stringToUTF8(id, eventStruct + 132, 128)
}

function registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId,
    eventTypeString, targetThread) {
    if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc(260);
    var pointerlockChangeEventHandlerFunc = function (ev) {
        var e = ev || event;
        var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
        fillPointerlockChangeEventData(pointerlockChangeEvent);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: pointerlockChangeEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc,
targetThread) {
    if (!document || !document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !
        document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
        return -1
    }
    target = findEventTarget(target);
    if (!target) return -4;
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange",
        targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange",
        targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange",
        targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange",
        targetThread);
    return 0
}

function registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
targetThread) {
    if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);
    target = findEventTarget(target);
    var uiEventHandlerFunc = function (ev) {
        var e = ev || event;
        if (e.target != target) {
            return
        }
        var b = document.body;
        if (!b) {
            return
        }
        var uiEvent = JSEvents.uiEvent;
        HEAP32[uiEvent >> 2] = e.detail;
        HEAP32[uiEvent + 4 >> 2] = b.clientWidth;
        HEAP32[uiEvent + 8 >> 2] = b.clientHeight;
        HEAP32[uiEvent + 12 >> 2] = innerWidth;
        HEAP32[uiEvent + 16 >> 2] = innerHeight;
        HEAP32[uiEvent + 20 >> 2] = outerWidth;
        HEAP32[uiEvent + 24 >> 2] = outerHeight;
        HEAP32[uiEvent + 28 >> 2] = pageXOffset;
        HEAP32[uiEvent + 32 >> 2] = pageYOffset;
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, uiEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
    return 0
}

function registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1696);
    target = findEventTarget(target);
    var touchEventHandlerFunc = function (e) {
        var t, touches = {},
            et = e.touches;
        for (var i = 0; i < et.length; ++i) {
            t = et[i];
            t.isChanged = t.onTarget = 0;
            touches[t.identifier] = t
        }
        for (var i = 0; i < e.changedTouches.length; ++i) {
            t = e.changedTouches[i];
            t.isChanged = 1;
            touches[t.identifier] = t
        }
        for (var i = 0; i < e.targetTouches.length; ++i) {
            touches[e.targetTouches[i].identifier].onTarget = 1
        }
        var touchEvent = JSEvents.touchEvent;
        HEAPF64[touchEvent >> 3] = e.timeStamp;
        var idx = touchEvent >> 2;
        HEAP32[idx + 3] = e.ctrlKey;
        HEAP32[idx + 4] = e.shiftKey;
        HEAP32[idx + 5] = e.altKey;
        HEAP32[idx + 6] = e.metaKey;
        idx += 7;
        var targetRect = getBoundingClientRect(target);
        var numTouches = 0;
        for (var i in touches) {
            t = touches[i];
            HEAP32[idx + 0] = t.identifier;
            HEAP32[idx + 1] = t.screenX;
            HEAP32[idx + 2] = t.screenY;
            HEAP32[idx + 3] = t.clientX;
            HEAP32[idx + 4] = t.clientY;
            HEAP32[idx + 5] = t.pageX;
            HEAP32[idx + 6] = t.pageY;
            HEAP32[idx + 7] = t.isChanged;
            HEAP32[idx + 8] = t.onTarget;
            HEAP32[idx + 9] = t.clientX - targetRect.left;
            HEAP32[idx + 10] = t.clientY - targetRect.top;
            idx += 13;
            if (++numTouches > 31) {
                break
            }
        }
        HEAP32[touchEvent + 8 >> 2] = numTouches;
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, touchEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
    return 0
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
    return 0
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
    return 0
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
    return 0
}

function fillVisibilityChangeEventData(eventStruct) {
    var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
    var visibilityState = visibilityStates.indexOf(document.visibilityState);
    HEAP32[eventStruct >> 2] = document.hidden;
    HEAP32[eventStruct + 4 >> 2] = visibilityState
}

function registerVisibilityChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc(8);
    var visibilityChangeEventHandlerFunc = function (ev) {
        var e = ev || event;
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
        fillVisibilityChangeEventData(visibilityChangeEvent);
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: visibilityChangeEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!specialHTMLTargets[1]) {
        return -4
    }
    registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21,
        "visibilitychange", targetThread);
    return 0
}

function registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString,
    targetThread) {
    if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(104);
    var wheelHandlerFunc = function (ev) {
        var e = ev || event;
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[wheelEvent + 72 >> 3] = e["deltaX"];
        HEAPF64[wheelEvent + 80 >> 3] = e["deltaY"];
        HEAPF64[wheelEvent + 88 >> 3] = e["deltaZ"];
        HEAP32[wheelEvent + 96 >> 2] = e["deltaMode"];
        if (function (a1, a2, a3) {
                return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3])
            }(eventTypeId, wheelEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    target = findEventTarget(target);
    if (typeof target.onwheel != "undefined") {
        registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
        return 0
    } else {
        return -1
    }
}

function _emscripten_set_window_title(title) {
    setWindowTitle(UTF8ToString(title))
}

function _emscripten_sleep(ms) {
    return Asyncify.handleSleep(wakeUp => safeSetTimeout(wakeUp, ms))
}

function _emscripten_wget(url, file) {
    return Asyncify.handleSleep(wakeUp => {
        var _url = UTF8ToString(url);
        var _file = UTF8ToString(file);
        _file = PATH_FS.resolve(FS.cwd(), _file);
        var destinationDirectory = PATH.dirname(_file);
        FS.createPreloadedFile(destinationDirectory, PATH.basename(_file), _url, true, true, wakeUp, wakeUp,
            false, false,
            function () {
                try {
                    FS.unlink(_file)
                } catch (e) {}
                FS.mkdirTree(destinationDirectory)
            })
    })
}

function _emscripten_wget_data(url, pbuffer, pnum, perror) {
    return Asyncify.handleSleep(wakeUp => {
        asyncLoad(UTF8ToString(url), byteArray => {
            var buffer = _malloc(byteArray.length);
            HEAPU8.set(byteArray, buffer);
            HEAP32[pbuffer >> 2] = buffer;
            HEAP32[pnum >> 2] = byteArray.length;
            HEAP32[perror >> 2] = 0;
            wakeUp()
        }, () => {
            HEAP32[perror >> 2] = 1;
            wakeUp()
        }, true)
    })
}
var ENV = {};

function getExecutableName() {
    return thisProgram || "./this.program"
}

function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-",
            "_") + ".UTF-8";
        var env = {
            "USER": "web_user",
            "LOGNAME": "web_user",
            "PATH": "/",
            "PWD": "/",
            "HOME": "/home/web_user",
            "LANG": lang,
            "_": getExecutableName()
        };
        for (var x in ENV) {
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x]
        }
        var strings = [];
        for (var x in env) {
            strings.push(x + "=" + env[x])
        }
        getEnvStrings.strings = strings
    }
    return getEnvStrings.strings
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0
}

function _environ_get(__environ, environ_buf) {
    var bufSize = 0;
    getEnvStrings().forEach(function (string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + i * 4 >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1
    });
    return 0
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    strings.forEach(function (string) {
        bufSize += string.length + 1
    });
    HEAPU32[penviron_buf_size >> 2] = bufSize;
    return 0
}

function _fd_close(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _fd_fdstat_get(fd, pbuf) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
        HEAP8[pbuf >> 0] = type;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function doReadv(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break
    }
    return ret
}

function _fd_pread(fd, iov, iovcnt, offset_low, offset_high, pnum) {
    try {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt, offset);
        HEAPU32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function doWritev(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr
    }
    return ret
}

function _fd_pwrite(fd, iov, iovcnt, offset_low, offset_high, pnum) {
    try {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt, offset);
        HEAPU32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _fd_read(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    try {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (
                Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((
                tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0],
            HEAP32[newOffset + 4 >> 2] = tempI64[1];
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _fd_sync(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return Asyncify.handleSleep(function (wakeUp) {
            var mount = stream.node.mount;
            if (!mount.type.syncfs) {
                wakeUp(0);
                return
            }
            mount.type.syncfs(mount, false, function (err) {
                if (err) {
                    wakeUp(function () {
                        return 29
                    });
                    return
                }
                wakeUp(0)
            })
        })
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _fd_write(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno
    }
}

function _getaddrinfo(node, service, hint, out) {
    var addr = 0;
    var port = 0;
    var flags = 0;
    var family = 0;
    var type = 0;
    var proto = 0;
    var ai;

    function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var errno;
        salen = family === 10 ? 28 : 16;
        addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
        sa = _malloc(salen);
        errno = writeSockaddr(sa, family, addr, port);
        assert(!errno);
        ai = _malloc(32);
        HEAP32[ai + 4 >> 2] = family;
        HEAP32[ai + 8 >> 2] = type;
        HEAP32[ai + 12 >> 2] = proto;
        HEAP32[ai + 24 >> 2] = canon;
        HEAPU32[ai + 20 >> 2] = sa;
        if (family === 10) {
            HEAP32[ai + 16 >> 2] = 28
        } else {
            HEAP32[ai + 16 >> 2] = 16
        }
        HEAP32[ai + 28 >> 2] = 0;
        return ai
    }
    if (hint) {
        flags = HEAP32[hint >> 2];
        family = HEAP32[hint + 4 >> 2];
        type = HEAP32[hint + 8 >> 2];
        proto = HEAP32[hint + 12 >> 2]
    }
    if (type && !proto) {
        proto = type === 2 ? 17 : 6
    }
    if (!type && proto) {
        type = proto === 17 ? 2 : 1
    }
    if (proto === 0) {
        proto = 6
    }
    if (type === 0) {
        type = 1
    }
    if (!node && !service) {
        return -2
    }
    if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
        return -1
    }
    if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
        return -1
    }
    if (flags & 32) {
        return -2
    }
    if (type !== 0 && type !== 1 && type !== 2) {
        return -7
    }
    if (family !== 0 && family !== 2 && family !== 10) {
        return -6
    }
    if (service) {
        service = UTF8ToString(service);
        port = parseInt(service, 10);
        if (isNaN(port)) {
            if (flags & 1024) {
                return -2
            }
            return -8
        }
    }
    if (!node) {
        if (family === 0) {
            family = 2
        }
        if ((flags & 1) === 0) {
            if (family === 2) {
                addr = _htonl(2130706433)
            } else {
                addr = [0, 0, 0, 1]
            }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAPU32[out >> 2] = ai;
        return 0
    }
    node = UTF8ToString(node);
    addr = inetPton4(node);
    if (addr !== null) {
        if (family === 0 || family === 2) {
            family = 2
        } else if (family === 10 && flags & 8) {
            addr = [0, 0, _htonl(65535), addr];
            family = 10
        } else {
            return -2
        }
    } else {
        addr = inetPton6(node);
        if (addr !== null) {
            if (family === 0 || family === 10) {
                family = 10
            } else {
                return -2
            }
        }
    }
    if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAPU32[out >> 2] = ai;
        return 0
    }
    if (flags & 4) {
        return -2
    }
    node = DNS.lookup_name(node);
    addr = inetPton4(node);
    if (family === 0) {
        family = 2
    } else if (family === 10) {
        addr = [0, 0, _htonl(65535), addr]
    }
    ai = allocaddrinfo(family, type, proto, null, addr, port);
    HEAPU32[out >> 2] = ai;
    return 0
}

function _getentropy(buffer, size) {
    if (!_getentropy.randomDevice) {
        _getentropy.randomDevice = getRandomDevice()
    }
    for (var i = 0; i < size; i++) {
        HEAP8[buffer + i >> 0] = _getentropy.randomDevice()
    }
    return 0
}

function getHostByName(name) {
    var ret = _malloc(20);
    var nameBuf = _malloc(name.length + 1);
    stringToUTF8(name, nameBuf, name.length + 1);
    HEAPU32[ret >> 2] = nameBuf;
    var aliasesBuf = _malloc(4);
    HEAPU32[aliasesBuf >> 2] = 0;
    HEAPU32[ret + 4 >> 2] = aliasesBuf;
    var afinet = 2;
    HEAP32[ret + 8 >> 2] = afinet;
    HEAP32[ret + 12 >> 2] = 4;
    var addrListBuf = _malloc(12);
    HEAPU32[addrListBuf >> 2] = addrListBuf + 8;
    HEAPU32[addrListBuf + 4 >> 2] = 0;
    HEAP32[addrListBuf + 8 >> 2] = inetPton4(DNS.lookup_name(name));
    HEAPU32[ret + 16 >> 2] = addrListBuf;
    return ret
}

function _gethostbyaddr(addr, addrlen, type) {
    if (type !== 2) {
        setErrNo(5);
        return null
    }
    addr = HEAP32[addr >> 2];
    var host = inetNtop4(addr);
    var lookup = DNS.lookup_addr(host);
    if (lookup) {
        host = lookup
    }
    return getHostByName(host)
}

function _gethostbyname(name) {
    return getHostByName(UTF8ToString(name))
}

function _getloadavg(loadavg, nelem) {
    var limit = Math.min(nelem, 3);
    var doubleSize = 8;
    for (var i = 0; i < limit; i++) {
        HEAPF64[loadavg + i * doubleSize >> 3] = .1
    }
    return limit
}

function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
    var info = readSockaddr(sa, salen);
    if (info.errno) {
        return -6
    }
    var port = info.port;
    var addr = info.addr;
    var overflowed = false;
    if (node && nodelen) {
        var lookup;
        if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
            if (flags & 8) {
                return -2
            }
        } else {
            addr = lookup
        }
        var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
        if (numBytesWrittenExclNull + 1 >= nodelen) {
            overflowed = true
        }
    }
    if (serv && servlen) {
        port = "" + port;
        var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
        if (numBytesWrittenExclNull + 1 >= servlen) {
            overflowed = true
        }
    }
    if (overflowed) {
        return -12
    }
    return 0
}
var Protocols = {
    list: [],
    map: {}
};

function _setprotoent(stayopen) {
    function allocprotoent(name, proto, aliases) {
        var nameBuf = _malloc(name.length + 1);
        writeAsciiToMemory(name, nameBuf);
        var j = 0;
        var length = aliases.length;
        var aliasListBuf = _malloc((length + 1) * 4);
        for (var i = 0; i < length; i++, j += 4) {
            var alias = aliases[i];
            var aliasBuf = _malloc(alias.length + 1);
            writeAsciiToMemory(alias, aliasBuf);
            HEAPU32[aliasListBuf + j >> 2] = aliasBuf
        }
        HEAPU32[aliasListBuf + j >> 2] = 0;
        var pe = _malloc(12);
        HEAPU32[pe >> 2] = nameBuf;
        HEAPU32[pe + 4 >> 2] = aliasListBuf;
        HEAP32[pe + 8 >> 2] = proto;
        return pe
    }
    var list = Protocols.list;
    var map = Protocols.map;
    if (list.length === 0) {
        var entry = allocprotoent("tcp", 6, ["TCP"]);
        list.push(entry);
        map["tcp"] = map["6"] = entry;
        entry = allocprotoent("udp", 17, ["UDP"]);
        list.push(entry);
        map["udp"] = map["17"] = entry
    }
    _setprotoent.index = 0
}

function _getprotobyname(name) {
    name = UTF8ToString(name);
    _setprotoent(true);
    var result = Protocols.map[name];
    return result
}

function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}

function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}

function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"
    ];

    function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }

    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }

    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }

    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
            case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
                return janFourth;
            case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30)
        }
    }

    function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            }
            return thisDate.getFullYear()
        }
        return thisDate.getFullYear() - 1
    }
    var EXPANSION_RULES_2 = {
        "%a": function (date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function (date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function (date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function (date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function (date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function (date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function (date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function (date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function (date) {
            return getWeekBasedYear(date)
        },
        "%H": function (date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function (date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function (date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ?
                __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function (date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function (date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function () {
            return "\n"
        },
        "%p": function (date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            }
            return "PM"
        },
        "%S": function (date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function () {
            return "\t"
        },
        "%u": function (date) {
            return date.tm_wday || 7
        },
        "%U": function (date) {
            var days = date.tm_yday + 7 - date.tm_wday;
            return leadingNulls(Math.floor(days / 7), 2)
        },
        "%V": function (date) {
            var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
            if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
                val++
            }
            if (!val) {
                val = 52;
                var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && __isLeapYear(date.tm_year % 400 - 1)) {
                    val++
                }
            } else if (val == 53) {
                var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date.tm_year))) val = 1
            }
            return leadingNulls(val, 2)
        },
        "%w": function (date) {
            return date.tm_wday
        },
        "%W": function (date) {
            var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
            return leadingNulls(Math.floor(days / 7), 2)
        },
        "%y": function (date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function (date) {
            return date.tm_year + 1900
        },
        "%z": function (date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function (date) {
            return date.tm_zone
        },
        "%%": function () {
            return "%"
        }
    };
    pattern = pattern.replace(/%%/g, "\0\0");
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
        }
    }
    pattern = pattern.replace(/\0\0/g, "%");
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}

function _system(command) {
    if (ENVIRONMENT_IS_NODE) {
        if (!command) return 1;
        var cmdstr = UTF8ToString(command);
        if (!cmdstr.length) return 0;
        var cp = require("child_process");
        var ret = cp.spawnSync(cmdstr, [], {
            shell: true,
            stdio: "inherit"
        });
        var _W_EXITCODE = (ret, sig) => ret << 8 | sig;
        if (ret.status === null) {
            var signalToNumber = sig => {
                switch (sig) {
                    case "SIGHUP":
                        return 1;
                    case "SIGINT":
                        return 2;
                    case "SIGQUIT":
                        return 3;
                    case "SIGFPE":
                        return 8;
                    case "SIGKILL":
                        return 9;
                    case "SIGALRM":
                        return 14;
                    case "SIGTERM":
                        return 15
                }
                return 2
            };
            return _W_EXITCODE(0, signalToNumber(ret.signal))
        }
        return _W_EXITCODE(ret.status, 0)
    }
    if (!command) return 0;
    setErrNo(52);
    return -1
}

function allocateUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function runAndAbortIfError(func) {
    try {
        return func()
    } catch (e) {
        abort(e)
    }
}

function runtimeKeepalivePush() {}

function runtimeKeepalivePop() {}
var Asyncify = {
    instrumentWasmImports: function (imports) {
        var ASYNCIFY_IMPORTS = ["env.invoke_*", "env.emscripten_sleep", "env.emscripten_wget",
            "env.emscripten_wget_data", "env.emscripten_idb_load", "env.emscripten_idb_store",
            "env.emscripten_idb_delete", "env.emscripten_idb_exists", "env.emscripten_idb_load_blob",
            "env.emscripten_idb_store_blob", "env.SDL_Delay", "env.emscripten_scan_registers",
            "env.emscripten_lazy_load_code", "env.emscripten_fiber_swap", "wasi_snapshot_preview1.fd_sync",
            "env.__wasi_fd_sync", "env._emval_await", "env._dlopen_js", "env.__asyncjs__*"
        ].map(x => x.split(".")[1]);
        for (var x in imports) {
            (function (x) {
                var original = imports[x];
                var sig = original.sig;
                if (typeof original == "function") {
                    var isAsyncifyImport = ASYNCIFY_IMPORTS.indexOf(x) >= 0 || x.startsWith("__asyncjs__")
                }
            })(x)
        }
    },
    instrumentWasmExports: function (exports) {
        var ret = {};
        for (var x in exports) {
            (function (x) {
                var original = exports[x];
                if (typeof original == "function") {
                    ret[x] = function () {
                        Asyncify.exportCallStack.push(x);
                        try {
                            return original.apply(null, arguments)
                        } finally {
                            if (!ABORT) {
                                var y = Asyncify.exportCallStack.pop();
                                assert(y === x);
                                Asyncify.maybeStopUnwind()
                            }
                        }
                    }
                } else {
                    ret[x] = original
                }
            })(x)
        }
        return ret
    },
    State: {
        Normal: 0,
        Unwinding: 1,
        Rewinding: 2,
        Disabled: 3
    },
    state: 0,
    StackSize: 65535,
    currData: null,
    handleSleepReturnValue: 0,
    exportCallStack: [],
    callStackNameToId: {},
    callStackIdToName: {},
    callStackId: 0,
    asyncPromiseHandlers: null,
    sleepCallbacks: [],
    getCallStackId: function (funcName) {
        var id = Asyncify.callStackNameToId[funcName];
        if (id === undefined) {
            id = Asyncify.callStackId++;
            Asyncify.callStackNameToId[funcName] = id;
            Asyncify.callStackIdToName[id] = funcName
        }
        return id
    },
    maybeStopUnwind: function () {
        if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack
            .length === 0) {
            Asyncify.state = Asyncify.State.Normal;
            runAndAbortIfError(_asyncify_stop_unwind);
            if (typeof Fibers != "undefined") {
                Fibers.trampoline()
            }
        }
    },
    whenDone: function () {
        return new Promise((resolve, reject) => {
            Asyncify.asyncPromiseHandlers = {
                resolve: resolve,
                reject: reject
            }
        })
    },
    allocateData: function () {
        var ptr = _malloc(12 + Asyncify.StackSize);
        Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
        Asyncify.setDataRewindFunc(ptr);
        return ptr
    },
    setDataHeader: function (ptr, stack, stackSize) {
        HEAP32[ptr >> 2] = stack;
        HEAP32[ptr + 4 >> 2] = stack + stackSize
    },
    setDataRewindFunc: function (ptr) {
        var bottomOfCallStack = Asyncify.exportCallStack[0];
        var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
        HEAP32[ptr + 8 >> 2] = rewindId
    },
    getDataRewindFunc: function (ptr) {
        var id = HEAP32[ptr + 8 >> 2];
        var name = Asyncify.callStackIdToName[id];
        var func = Module["asm"][name];
        return func
    },
    doRewind: function (ptr) {
        var start = Asyncify.getDataRewindFunc(ptr);
        return start()
    },
    handleSleep: function (startAsync) {
        if (ABORT) return;
        if (Asyncify.state === Asyncify.State.Normal) {
            var reachedCallback = false;
            var reachedAfterCallback = false;
            startAsync(handleSleepReturnValue => {
                if (ABORT) return;
                Asyncify.handleSleepReturnValue = handleSleepReturnValue || 0;
                reachedCallback = true;
                if (!reachedAfterCallback) {
                    return
                }
                Asyncify.state = Asyncify.State.Rewinding;
                runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                    Browser.mainLoop.resume()
                }
                var asyncWasmReturnValue, isError = false;
                try {
                    asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData)
                } catch (err) {
                    asyncWasmReturnValue = err;
                    isError = true
                }
                var handled = false;
                if (!Asyncify.currData) {
                    var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
                    if (asyncPromiseHandlers) {
                        Asyncify.asyncPromiseHandlers = null;
                        (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(
                            asyncWasmReturnValue);
                        handled = true
                    }
                }
                if (isError && !handled) {
                    throw asyncWasmReturnValue
                }
            });
            reachedAfterCallback = true;
            if (!reachedCallback) {
                Asyncify.state = Asyncify.State.Unwinding;
                Asyncify.currData = Asyncify.allocateData();
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                    Browser.mainLoop.pause()
                }
                runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData))
            }
        } else if (Asyncify.state === Asyncify.State.Rewinding) {
            Asyncify.state = Asyncify.State.Normal;
            runAndAbortIfError(_asyncify_stop_rewind);
            _free(Asyncify.currData);
            Asyncify.currData = null;
            Asyncify.sleepCallbacks.forEach(func => callUserCallback(func))
        } else {
            abort("invalid state: " + Asyncify.state)
        }
        return Asyncify.handleSleepReturnValue
    },
    handleAsync: function (startAsync) {
        return Asyncify.handleSleep(wakeUp => {
            startAsync().then(wakeUp)
        })
    }
};

function demangle(func) {
    return func
}

function demangleAll(text) {
    var regex = /\b_Z[\w\d_]+/g;
    return text.replace(regex, function (x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    })
}

function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}

function getCFunc(ident) {
    var func = Module["_" + ident];
    return func
}

function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        "string": str => {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len)
            }
            return ret
        },
        "array": arr => {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }
    };

    function convertReturnValue(ret) {
        if (returnType === "string") {
            return UTF8ToString(ret)
        }
        if (returnType === "boolean") return Boolean(ret);
        return ret
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var previousAsync = Asyncify.currData;
    var ret = func.apply(null, cArgs);

    function onDone(ret) {
        runtimeKeepalivePop();
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret)
    }
    runtimeKeepalivePush();
    var asyncMode = opts && opts.async;
    if (Asyncify.currData != previousAsync) {
        return Asyncify.whenDone().then(onDone)
    }
    ret = onDone(ret);
    if (asyncMode) return Promise.resolve(ret);
    return ret
}
var FSNode = function (parent, name, mode, rdev) {
    if (!parent) {
        parent = this
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function () {
            return (this.mode & readMode) === readMode
        },
        set: function (val) {
            val ? this.mode |= readMode : this.mode &= ~readMode
        }
    },
    write: {
        get: function () {
            return (this.mode & writeMode) === writeMode
        },
        set: function (val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode
        }
    },
    isFolder: {
        get: function () {
            return FS.isDir(this.mode)
        }
    },
    isDevice: {
        get: function () {
            return FS.isChrdev(this.mode)
        }
    }
});
FS.FSNode = FSNode;
FS.staticInit();
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_unlink"] = FS.unlink;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) {
    Browser.requestFullscreen(lockPointer, resizeCanvas)
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
};
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
};
var preloadedImages = {};
var preloadedAudios = {};
var GLctx;
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
for (var i = 0; i < 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1)
}
var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
for (var i = 0; i < 288; ++i) {
    __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i + 1)
}
var asmLibraryArg = {
    "Da": _Py_CheckEmscriptenSignals_Helper,
    "th": _Py_emscripten_runtime,
    "a": ___assert_fail,
    "sh": ___call_sighandler,
    "rh": ___syscall__newselect,
    "Ca": ___syscall_accept4,
    "qh": ___syscall_bind,
    "Ba": ___syscall_chdir,
    "Aa": ___syscall_chmod,
    "ph": ___syscall_connect,
    "za": ___syscall_dup3,
    "oh": ___syscall_faccessat,
    "Na": ___syscall_fadvise64,
    "nh": ___syscall_fchdir,
    "mh": ___syscall_fchmod,
    "ya": ___syscall_fchmodat,
    "lh": ___syscall_fchown32,
    "xa": ___syscall_fchownat,
    "j": ___syscall_fcntl64,
    "kh": ___syscall_fdatasync,
    "wa": ___syscall_fstat64,
    "jh": ___syscall_fstatfs64,
    "Ma": ___syscall_ftruncate64,
    "ih": ___syscall_getcwd,
    "hh": ___syscall_getdents64,
    "gh": ___syscall_getpeername,
    "fh": ___syscall_getsockname,
    "eh": ___syscall_getsockopt,
    "I": ___syscall_ioctl,
    "dh": ___syscall_listen,
    "ch": ___syscall_lstat64,
    "va": ___syscall_mkdirat,
    "H": ___syscall_newfstatat,
    "r": ___syscall_openat,
    "bh": ___syscall_pipe,
    "ah": ___syscall_poll,
    "ua": ___syscall_readlinkat,
    "$g": ___syscall_recvfrom,
    "_g": ___syscall_recvmsg,
    "ta": ___syscall_renameat,
    "Zg": ___syscall_rmdir,
    "Yg": ___syscall_sendmsg,
    "Xg": ___syscall_sendto,
    "sa": ___syscall_socket,
    "Wg": ___syscall_stat64,
    "Vg": ___syscall_statfs64,
    "Ug": ___syscall_symlink,
    "La": ___syscall_truncate64,
    "ra": ___syscall_unlinkat,
    "Tg": ___syscall_utimensat,
    "Og": __dlinit,
    "Ng": __dlopen_js,
    "Mg": __dlsym_js,
    "pa": __emscripten_get_now_is_monotonic,
    "Lg": __emscripten_throw_longjmp,
    "Kg": __gmtime_js,
    "Jg": __localtime_js,
    "Ig": __mktime_js,
    "Hg": __mmap_js,
    "Gg": __msync_js,
    "Fg": __munmap_js,
    "Eg": __tzset_js,
    "b": _abort,
    "Dg": _eglBindAPI,
    "Cg": _eglChooseConfig,
    "Bg": _eglCreateContext,
    "Ag": _eglCreateWindowSurface,
    "zg": _eglDestroyContext,
    "yg": _eglDestroySurface,
    "xg": _eglGetConfigAttrib,
    "oa": _eglGetDisplay,
    "wg": _eglGetError,
    "vg": _eglInitialize,
    "ug": _eglMakeCurrent,
    "tg": _eglQueryString,
    "sg": _eglSwapBuffers,
    "rg": _eglSwapInterval,
    "qg": _eglTerminate,
    "pg": _eglWaitGL,
    "og": _eglWaitNative,
    "A": _emscripten_asm_const_int,
    "h": _emscripten_asm_const_int_sync_on_main_thread,
    "ng": _emscripten_async_call,
    "mg": _emscripten_async_wget_data,
    "lg": _emscripten_cancel_main_loop,
    "w": _emscripten_date_now,
    "kg": _emscripten_debugger,
    "jg": _emscripten_exit_fullscreen,
    "ig": _emscripten_exit_pointerlock,
    "hg": _emscripten_exit_with_live_runtime,
    "gg": _emscripten_get_battery_status,
    "na": _emscripten_get_callstack,
    "fg": _emscripten_get_compiler_setting,
    "v": _emscripten_get_device_pixel_ratio,
    "l": _emscripten_get_element_css_size,
    "ma": _emscripten_get_gamepad_status,
    "eg": _emscripten_get_heap_max,
    "F": _emscripten_get_now,
    "dg": _emscripten_get_now_res,
    "cg": _emscripten_get_num_gamepads,
    "bg": _emscripten_get_preloaded_image_data_from_FILE,
    "ag": _emscripten_get_screen_size,
    "$f": _emscripten_glActiveTexture,
    "_f": _emscripten_glAttachShader,
    "Zf": _emscripten_glBeginQuery,
    "Yf": _emscripten_glBeginQueryEXT,
    "Xf": _emscripten_glBeginTransformFeedback,
    "Wf": _emscripten_glBindAttribLocation,
    "Vf": _emscripten_glBindBuffer,
    "Uf": _emscripten_glBindBufferBase,
    "Tf": _emscripten_glBindBufferRange,
    "Sf": _emscripten_glBindFramebuffer,
    "Rf": _emscripten_glBindRenderbuffer,
    "Qf": _emscripten_glBindSampler,
    "Pf": _emscripten_glBindTexture,
    "Of": _emscripten_glBindTransformFeedback,
    "Nf": _emscripten_glBindVertexArray,
    "Mf": _emscripten_glBindVertexArrayOES,
    "Lf": _emscripten_glBlendColor,
    "Kf": _emscripten_glBlendEquation,
    "Jf": _emscripten_glBlendEquationSeparate,
    "If": _emscripten_glBlendFunc,
    "Hf": _emscripten_glBlendFuncSeparate,
    "Gf": _emscripten_glBlitFramebuffer,
    "Ff": _emscripten_glBufferData,
    "Ef": _emscripten_glBufferSubData,
    "Df": _emscripten_glCheckFramebufferStatus,
    "Cf": _emscripten_glClear,
    "Bf": _emscripten_glClearBufferfi,
    "Af": _emscripten_glClearBufferfv,
    "zf": _emscripten_glClearBufferiv,
    "yf": _emscripten_glClearBufferuiv,
    "xf": _emscripten_glClearColor,
    "wf": _emscripten_glClearDepthf,
    "vf": _emscripten_glClearStencil,
    "uf": _emscripten_glClientWaitSync,
    "tf": _emscripten_glColorMask,
    "sf": _emscripten_glCompileShader,
    "rf": _emscripten_glCompressedTexImage2D,
    "qf": _emscripten_glCompressedTexImage3D,
    "pf": _emscripten_glCompressedTexSubImage2D,
    "of": _emscripten_glCompressedTexSubImage3D,
    "nf": _emscripten_glCopyBufferSubData,
    "mf": _emscripten_glCopyTexImage2D,
    "lf": _emscripten_glCopyTexSubImage2D,
    "kf": _emscripten_glCopyTexSubImage3D,
    "jf": _emscripten_glCreateProgram,
    "hf": _emscripten_glCreateShader,
    "gf": _emscripten_glCullFace,
    "ff": _emscripten_glDeleteBuffers,
    "ef": _emscripten_glDeleteFramebuffers,
    "df": _emscripten_glDeleteProgram,
    "cf": _emscripten_glDeleteQueries,
    "bf": _emscripten_glDeleteQueriesEXT,
    "af": _emscripten_glDeleteRenderbuffers,
    "$e": _emscripten_glDeleteSamplers,
    "_e": _emscripten_glDeleteShader,
    "Ze": _emscripten_glDeleteSync,
    "Ye": _emscripten_glDeleteTextures,
    "Xe": _emscripten_glDeleteTransformFeedbacks,
    "We": _emscripten_glDeleteVertexArrays,
    "Ve": _emscripten_glDeleteVertexArraysOES,
    "Ue": _emscripten_glDepthFunc,
    "Te": _emscripten_glDepthMask,
    "Se": _emscripten_glDepthRangef,
    "Re": _emscripten_glDetachShader,
    "Qe": _emscripten_glDisable,
    "Pe": _emscripten_glDisableVertexAttribArray,
    "Oe": _emscripten_glDrawArrays,
    "Ne": _emscripten_glDrawArraysInstanced,
    "Me": _emscripten_glDrawArraysInstancedANGLE,
    "Le": _emscripten_glDrawArraysInstancedARB,
    "Ke": _emscripten_glDrawArraysInstancedEXT,
    "Je": _emscripten_glDrawArraysInstancedNV,
    "Ie": _emscripten_glDrawBuffers,
    "He": _emscripten_glDrawBuffersEXT,
    "Ge": _emscripten_glDrawBuffersWEBGL,
    "Fe": _emscripten_glDrawElements,
    "Ee": _emscripten_glDrawElementsInstanced,
    "De": _emscripten_glDrawElementsInstancedANGLE,
    "Ce": _emscripten_glDrawElementsInstancedARB,
    "Be": _emscripten_glDrawElementsInstancedEXT,
    "Ae": _emscripten_glDrawElementsInstancedNV,
    "ze": _emscripten_glDrawRangeElements,
    "ye": _emscripten_glEnable,
    "xe": _emscripten_glEnableVertexAttribArray,
    "we": _emscripten_glEndQuery,
    "ve": _emscripten_glEndQueryEXT,
    "ue": _emscripten_glEndTransformFeedback,
    "te": _emscripten_glFenceSync,
    "se": _emscripten_glFinish,
    "re": _emscripten_glFlush,
    "qe": _emscripten_glFramebufferRenderbuffer,
    "pe": _emscripten_glFramebufferTexture2D,
    "oe": _emscripten_glFramebufferTextureLayer,
    "ne": _emscripten_glFrontFace,
    "me": _emscripten_glGenBuffers,
    "le": _emscripten_glGenFramebuffers,
    "ke": _emscripten_glGenQueries,
    "je": _emscripten_glGenQueriesEXT,
    "ie": _emscripten_glGenRenderbuffers,
    "he": _emscripten_glGenSamplers,
    "ge": _emscripten_glGenTextures,
    "fe": _emscripten_glGenTransformFeedbacks,
    "ee": _emscripten_glGenVertexArrays,
    "de": _emscripten_glGenVertexArraysOES,
    "ce": _emscripten_glGenerateMipmap,
    "be": _emscripten_glGetActiveAttrib,
    "ae": _emscripten_glGetActiveUniform,
    "$d": _emscripten_glGetActiveUniformBlockName,
    "_d": _emscripten_glGetActiveUniformBlockiv,
    "Zd": _emscripten_glGetActiveUniformsiv,
    "Yd": _emscripten_glGetAttachedShaders,
    "Xd": _emscripten_glGetAttribLocation,
    "Wd": _emscripten_glGetBooleanv,
    "Vd": _emscripten_glGetBufferParameteri64v,
    "Ud": _emscripten_glGetBufferParameteriv,
    "Td": _emscripten_glGetError,
    "Sd": _emscripten_glGetFloatv,
    "Rd": _emscripten_glGetFragDataLocation,
    "Qd": _emscripten_glGetFramebufferAttachmentParameteriv,
    "Pd": _emscripten_glGetInteger64i_v,
    "Od": _emscripten_glGetInteger64v,
    "Nd": _emscripten_glGetIntegeri_v,
    "Md": _emscripten_glGetIntegerv,
    "Ld": _emscripten_glGetInternalformativ,
    "Kd": _emscripten_glGetProgramBinary,
    "Jd": _emscripten_glGetProgramInfoLog,
    "Id": _emscripten_glGetProgramiv,
    "Hd": _emscripten_glGetQueryObjecti64vEXT,
    "Gd": _emscripten_glGetQueryObjectivEXT,
    "Fd": _emscripten_glGetQueryObjectui64vEXT,
    "Ed": _emscripten_glGetQueryObjectuiv,
    "Dd": _emscripten_glGetQueryObjectuivEXT,
    "Cd": _emscripten_glGetQueryiv,
    "Bd": _emscripten_glGetQueryivEXT,
    "Ad": _emscripten_glGetRenderbufferParameteriv,
    "zd": _emscripten_glGetSamplerParameterfv,
    "yd": _emscripten_glGetSamplerParameteriv,
    "xd": _emscripten_glGetShaderInfoLog,
    "wd": _emscripten_glGetShaderPrecisionFormat,
    "vd": _emscripten_glGetShaderSource,
    "ud": _emscripten_glGetShaderiv,
    "td": _emscripten_glGetString,
    "sd": _emscripten_glGetStringi,
    "rd": _emscripten_glGetSynciv,
    "qd": _emscripten_glGetTexParameterfv,
    "pd": _emscripten_glGetTexParameteriv,
    "od": _emscripten_glGetTransformFeedbackVarying,
    "nd": _emscripten_glGetUniformBlockIndex,
    "md": _emscripten_glGetUniformIndices,
    "ld": _emscripten_glGetUniformLocation,
    "kd": _emscripten_glGetUniformfv,
    "jd": _emscripten_glGetUniformiv,
    "id": _emscripten_glGetUniformuiv,
    "hd": _emscripten_glGetVertexAttribIiv,
    "gd": _emscripten_glGetVertexAttribIuiv,
    "fd": _emscripten_glGetVertexAttribPointerv,
    "ed": _emscripten_glGetVertexAttribfv,
    "dd": _emscripten_glGetVertexAttribiv,
    "cd": _emscripten_glHint,
    "bd": _emscripten_glInvalidateFramebuffer,
    "ad": _emscripten_glInvalidateSubFramebuffer,
    "$c": _emscripten_glIsBuffer,
    "_c": _emscripten_glIsEnabled,
    "Zc": _emscripten_glIsFramebuffer,
    "Yc": _emscripten_glIsProgram,
    "Xc": _emscripten_glIsQuery,
    "Wc": _emscripten_glIsQueryEXT,
    "Vc": _emscripten_glIsRenderbuffer,
    "Uc": _emscripten_glIsSampler,
    "Tc": _emscripten_glIsShader,
    "Sc": _emscripten_glIsSync,
    "Rc": _emscripten_glIsTexture,
    "Qc": _emscripten_glIsTransformFeedback,
    "Pc": _emscripten_glIsVertexArray,
    "Oc": _emscripten_glIsVertexArrayOES,
    "Nc": _emscripten_glLineWidth,
    "Mc": _emscripten_glLinkProgram,
    "Lc": _emscripten_glPauseTransformFeedback,
    "Kc": _emscripten_glPixelStorei,
    "Jc": _emscripten_glPolygonOffset,
    "Ic": _emscripten_glProgramBinary,
    "Hc": _emscripten_glProgramParameteri,
    "Gc": _emscripten_glQueryCounterEXT,
    "Fc": _emscripten_glReadBuffer,
    "Ec": _emscripten_glReadPixels,
    "Dc": _emscripten_glReleaseShaderCompiler,
    "Cc": _emscripten_glRenderbufferStorage,
    "Bc": _emscripten_glRenderbufferStorageMultisample,
    "Ac": _emscripten_glResumeTransformFeedback,
    "zc": _emscripten_glSampleCoverage,
    "yc": _emscripten_glSamplerParameterf,
    "xc": _emscripten_glSamplerParameterfv,
    "wc": _emscripten_glSamplerParameteri,
    "vc": _emscripten_glSamplerParameteriv,
    "uc": _emscripten_glScissor,
    "tc": _emscripten_glShaderBinary,
    "sc": _emscripten_glShaderSource,
    "rc": _emscripten_glStencilFunc,
    "qc": _emscripten_glStencilFuncSeparate,
    "pc": _emscripten_glStencilMask,
    "oc": _emscripten_glStencilMaskSeparate,
    "nc": _emscripten_glStencilOp,
    "mc": _emscripten_glStencilOpSeparate,
    "lc": _emscripten_glTexImage2D,
    "kc": _emscripten_glTexImage3D,
    "jc": _emscripten_glTexParameterf,
    "ic": _emscripten_glTexParameterfv,
    "hc": _emscripten_glTexParameteri,
    "gc": _emscripten_glTexParameteriv,
    "fc": _emscripten_glTexStorage2D,
    "ec": _emscripten_glTexStorage3D,
    "dc": _emscripten_glTexSubImage2D,
    "cc": _emscripten_glTexSubImage3D,
    "bc": _emscripten_glTransformFeedbackVaryings,
    "ac": _emscripten_glUniform1f,
    "$b": _emscripten_glUniform1fv,
    "_b": _emscripten_glUniform1i,
    "Zb": _emscripten_glUniform1iv,
    "Yb": _emscripten_glUniform1ui,
    "Xb": _emscripten_glUniform1uiv,
    "Wb": _emscripten_glUniform2f,
    "Vb": _emscripten_glUniform2fv,
    "Ub": _emscripten_glUniform2i,
    "Tb": _emscripten_glUniform2iv,
    "Sb": _emscripten_glUniform2ui,
    "Rb": _emscripten_glUniform2uiv,
    "Qb": _emscripten_glUniform3f,
    "Pb": _emscripten_glUniform3fv,
    "Ob": _emscripten_glUniform3i,
    "Nb": _emscripten_glUniform3iv,
    "Mb": _emscripten_glUniform3ui,
    "Lb": _emscripten_glUniform3uiv,
    "Kb": _emscripten_glUniform4f,
    "Jb": _emscripten_glUniform4fv,
    "Ib": _emscripten_glUniform4i,
    "Hb": _emscripten_glUniform4iv,
    "Gb": _emscripten_glUniform4ui,
    "Fb": _emscripten_glUniform4uiv,
    "Eb": _emscripten_glUniformBlockBinding,
    "Db": _emscripten_glUniformMatrix2fv,
    "Cb": _emscripten_glUniformMatrix2x3fv,
    "Bb": _emscripten_glUniformMatrix2x4fv,
    "Ab": _emscripten_glUniformMatrix3fv,
    "zb": _emscripten_glUniformMatrix3x2fv,
    "yb": _emscripten_glUniformMatrix3x4fv,
    "xb": _emscripten_glUniformMatrix4fv,
    "wb": _emscripten_glUniformMatrix4x2fv,
    "vb": _emscripten_glUniformMatrix4x3fv,
    "ub": _emscripten_glUseProgram,
    "tb": _emscripten_glValidateProgram,
    "sb": _emscripten_glVertexAttrib1f,
    "rb": _emscripten_glVertexAttrib1fv,
    "qb": _emscripten_glVertexAttrib2f,
    "pb": _emscripten_glVertexAttrib2fv,
    "ob": _emscripten_glVertexAttrib3f,
    "nb": _emscripten_glVertexAttrib3fv,
    "mb": _emscripten_glVertexAttrib4f,
    "lb": _emscripten_glVertexAttrib4fv,
    "kb": _emscripten_glVertexAttribDivisor,
    "jb": _emscripten_glVertexAttribDivisorANGLE,
    "ib": _emscripten_glVertexAttribDivisorARB,
    "hb": _emscripten_glVertexAttribDivisorEXT,
    "gb": _emscripten_glVertexAttribDivisorNV,
    "fb": _emscripten_glVertexAttribI4i,
    "eb": _emscripten_glVertexAttribI4iv,
    "db": _emscripten_glVertexAttribI4ui,
    "cb": _emscripten_glVertexAttribI4uiv,
    "bb": _emscripten_glVertexAttribIPointer,
    "ab": _emscripten_glVertexAttribPointer,
    "$a": _emscripten_glViewport,
    "_a": _emscripten_glWaitSync,
    "E": _emscripten_has_asyncify,
    "q": _emscripten_log,
    "Za": _emscripten_memcpy_big,
    "Ya": _emscripten_request_fullscreen_strategy,
    "la": _emscripten_request_pointerlock,
    "Xa": _emscripten_resize_heap,
    "u": _emscripten_run_script,
    "Wa": _emscripten_run_script_int,
    "ka": _emscripten_run_script_string,
    "ja": _emscripten_sample_gamepad_data,
    "ia": _emscripten_set_beforeunload_callback_on_thread,
    "ha": _emscripten_set_blur_callback_on_thread,
    "t": _emscripten_set_canvas_element_size,
    "D": _emscripten_set_element_css_size,
    "ga": _emscripten_set_focus_callback_on_thread,
    "fa": _emscripten_set_fullscreenchange_callback_on_thread,
    "ea": _emscripten_set_gamepadconnected_callback_on_thread,
    "da": _emscripten_set_gamepaddisconnected_callback_on_thread,
    "ca": _emscripten_set_keydown_callback_on_thread,
    "ba": _emscripten_set_keypress_callback_on_thread,
    "aa": _emscripten_set_keyup_callback_on_thread,
    "Va": _emscripten_set_main_loop_arg,
    "$": _emscripten_set_mousedown_callback_on_thread,
    "_": _emscripten_set_mouseenter_callback_on_thread,
    "Z": _emscripten_set_mouseleave_callback_on_thread,
    "Y": _emscripten_set_mousemove_callback_on_thread,
    "X": _emscripten_set_mouseup_callback_on_thread,
    "W": _emscripten_set_pointerlockchange_callback_on_thread,
    "V": _emscripten_set_resize_callback_on_thread,
    "U": _emscripten_set_touchcancel_callback_on_thread,
    "T": _emscripten_set_touchend_callback_on_thread,
    "S": _emscripten_set_touchmove_callback_on_thread,
    "R": _emscripten_set_touchstart_callback_on_thread,
    "Q": _emscripten_set_visibilitychange_callback_on_thread,
    "P": _emscripten_set_wheel_callback_on_thread,
    "Ua": _emscripten_set_window_title,
    "z": _emscripten_sleep,
    "Ta": _emscripten_wget,
    "Sa": _emscripten_wget_data,
    "Sg": _environ_get,
    "Rg": _environ_sizes_get,
    "p": _exit,
    "m": _fd_close,
    "qa": _fd_fdstat_get,
    "Ka": _fd_pread,
    "Ja": _fd_pwrite,
    "G": _fd_read,
    "Ia": _fd_seek,
    "Qg": _fd_sync,
    "B": _fd_write,
    "y": _getaddrinfo,
    "O": _getentropy,
    "Ra": _gethostbyaddr,
    "Qa": _gethostbyname,
    "Pa": _getloadavg,
    "N": _getnameinfo,
    "Oa": _getprotobyname,
    "M": invoke_i,
    "c": invoke_ii,
    "e": invoke_iii,
    "g": invoke_iiii,
    "o": invoke_iiiii,
    "i": invoke_iiiiii,
    "C": invoke_iiiiiiiii,
    "L": invoke_iiiiiiiiii,
    "Ha": invoke_ji,
    "Ga": invoke_jiji,
    "n": invoke_v,
    "f": invoke_vi,
    "d": invoke_vii,
    "k": invoke_viii,
    "s": invoke_viiii,
    "x": invoke_viiiii,
    "K": invoke_viiiiiii,
    "J": invoke_viiiiiiiii,
    "Pg": _proc_exit,
    "Fa": _strftime,
    "Ea": _system
};
var asm = createWasm();
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["vh"]).apply(null, arguments)
};
var _malloc = Module["_malloc"] = function () {
    return (_malloc = Module["_malloc"] = Module["asm"]["wh"]).apply(null, arguments)
};
var _free = Module["_free"] = function () {
    return (_free = Module["_free"] = Module["asm"]["xh"]).apply(null, arguments)
};
var _main = Module["_main"] = function () {
    return (_main = Module["_main"] = Module["asm"]["yh"]).apply(null, arguments)
};
var _fileno = Module["_fileno"] = function () {
    return (_fileno = Module["_fileno"] = Module["asm"]["zh"]).apply(null, arguments)
};
var ___errno_location = Module["___errno_location"] = function () {
    return (___errno_location = Module["___errno_location"] = Module["asm"]["Bh"]).apply(null, arguments)
};
var _ntohs = Module["_ntohs"] = function () {
    return (_ntohs = Module["_ntohs"] = Module["asm"]["Ch"]).apply(null, arguments)
};
var _htons = Module["_htons"] = function () {
    return (_htons = Module["_htons"] = Module["asm"]["Dh"]).apply(null, arguments)
};
var _htonl = Module["_htonl"] = function () {
    return (_htonl = Module["_htonl"] = Module["asm"]["Eh"]).apply(null, arguments)
};
var _emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = function () {
    return (_emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = Module["asm"]["Fh"]).apply(null,
        arguments)
};
var _setThrew = Module["_setThrew"] = function () {
    return (_setThrew = Module["_setThrew"] = Module["asm"]["Gh"]).apply(null, arguments)
};
var stackSave = Module["stackSave"] = function () {
    return (stackSave = Module["stackSave"] = Module["asm"]["Hh"]).apply(null, arguments)
};
var stackRestore = Module["stackRestore"] = function () {
    return (stackRestore = Module["stackRestore"] = Module["asm"]["Ih"]).apply(null, arguments)
};
var stackAlloc = Module["stackAlloc"] = function () {
    return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Jh"]).apply(null, arguments)
};
var dynCall_iii = Module["dynCall_iii"] = function () {
    return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["Kh"]).apply(null, arguments)
};
var dynCall_iiii = Module["dynCall_iiii"] = function () {
    return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["Lh"]).apply(null, arguments)
};
var dynCall_vii = Module["dynCall_vii"] = function () {
    return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["Mh"]).apply(null, arguments)
};
var dynCall_viii = Module["dynCall_viii"] = function () {
    return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["Nh"]).apply(null, arguments)
};
var dynCall_ii = Module["dynCall_ii"] = function () {
    return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["Oh"]).apply(null, arguments)
};
var dynCall_vi = Module["dynCall_vi"] = function () {
    return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["Ph"]).apply(null, arguments)
};
var dynCall_iiiii = Module["dynCall_iiiii"] = function () {
    return (dynCall_iiiii = Module["dynCall_iiiii"] = Module["asm"]["Qh"]).apply(null, arguments)
};
var dynCall_iiiiii = Module["dynCall_iiiiii"] = function () {
    return (dynCall_iiiiii = Module["dynCall_iiiiii"] = Module["asm"]["Rh"]).apply(null, arguments)
};
var dynCall_i = Module["dynCall_i"] = function () {
    return (dynCall_i = Module["dynCall_i"] = Module["asm"]["Sh"]).apply(null, arguments)
};
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function () {
    return (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = Module["asm"]["Th"]).apply(null, arguments)
};
var dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = function () {
    return (dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = Module["asm"]["Uh"]).apply(null, arguments)
};
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function () {
    return (dynCall_iiiiiii = Module["dynCall_iiiiiii"] = Module["asm"]["Vh"]).apply(null, arguments)
};
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = function () {
    return (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = Module["asm"]["Wh"]).apply(null, arguments)
};
var dynCall_iji = Module["dynCall_iji"] = function () {
    return (dynCall_iji = Module["dynCall_iji"] = Module["asm"]["Xh"]).apply(null, arguments)
};
var dynCall_viiiii = Module["dynCall_viiiii"] = function () {
    return (dynCall_viiiii = Module["dynCall_viiiii"] = Module["asm"]["Yh"]).apply(null, arguments)
};
var dynCall_jii = Module["dynCall_jii"] = function () {
    return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["Zh"]).apply(null, arguments)
};
var dynCall_ddd = Module["dynCall_ddd"] = function () {
    return (dynCall_ddd = Module["dynCall_ddd"] = Module["asm"]["_h"]).apply(null, arguments)
};
var dynCall_dd = Module["dynCall_dd"] = function () {
    return (dynCall_dd = Module["dynCall_dd"] = Module["asm"]["$h"]).apply(null, arguments)
};
var dynCall_viiii = Module["dynCall_viiii"] = function () {
    return (dynCall_viiii = Module["dynCall_viiii"] = Module["asm"]["ai"]).apply(null, arguments)
};
var dynCall_viiiiii = Module["dynCall_viiiiii"] = function () {
    return (dynCall_viiiiii = Module["dynCall_viiiiii"] = Module["asm"]["bi"]).apply(null, arguments)
};
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function () {
    return (dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = Module["asm"]["ci"]).apply(null, arguments)
};
var dynCall_jiji = Module["dynCall_jiji"] = function () {
    return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["di"]).apply(null, arguments)
};
var dynCall_ji = Module["dynCall_ji"] = function () {
    return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["ei"]).apply(null, arguments)
};
var dynCall_iff = Module["dynCall_iff"] = function () {
    return (dynCall_iff = Module["dynCall_iff"] = Module["asm"]["fi"]).apply(null, arguments)
};
var dynCall_ifffff = Module["dynCall_ifffff"] = function () {
    return (dynCall_ifffff = Module["dynCall_ifffff"] = Module["asm"]["gi"]).apply(null, arguments)
};
var dynCall_ifff = Module["dynCall_ifff"] = function () {
    return (dynCall_ifff = Module["dynCall_ifff"] = Module["asm"]["hi"]).apply(null, arguments)
};
var dynCall_viiiffff = Module["dynCall_viiiffff"] = function () {
    return (dynCall_viiiffff = Module["dynCall_viiiffff"] = Module["asm"]["ii"]).apply(null, arguments)
};
var dynCall_viiiiffff = Module["dynCall_viiiiffff"] = function () {
    return (dynCall_viiiiffff = Module["dynCall_viiiiffff"] = Module["asm"]["ji"]).apply(null, arguments)
};
var dynCall_viiiiiffff = Module["dynCall_viiiiiffff"] = function () {
    return (dynCall_viiiiiffff = Module["dynCall_viiiiiffff"] = Module["asm"]["ki"]).apply(null, arguments)
};
var dynCall_iiiiddi = Module["dynCall_iiiiddi"] = function () {
    return (dynCall_iiiiddi = Module["dynCall_iiiiddi"] = Module["asm"]["li"]).apply(null, arguments)
};
var dynCall_vidddddd = Module["dynCall_vidddddd"] = function () {
    return (dynCall_vidddddd = Module["dynCall_vidddddd"] = Module["asm"]["mi"]).apply(null, arguments)
};
var dynCall_viffff = Module["dynCall_viffff"] = function () {
    return (dynCall_viffff = Module["dynCall_viffff"] = Module["asm"]["ni"]).apply(null, arguments)
};
var dynCall_vidi = Module["dynCall_vidi"] = function () {
    return (dynCall_vidi = Module["dynCall_vidi"] = Module["asm"]["oi"]).apply(null, arguments)
};
var dynCall_vid = Module["dynCall_vid"] = function () {
    return (dynCall_vid = Module["dynCall_vid"] = Module["asm"]["pi"]).apply(null, arguments)
};
var dynCall_iiiiddddiiii = Module["dynCall_iiiiddddiiii"] = function () {
    return (dynCall_iiiiddddiiii = Module["dynCall_iiiiddddiiii"] = Module["asm"]["qi"]).apply(null, arguments)
};
var dynCall_iiddiddiii = Module["dynCall_iiddiddiii"] = function () {
    return (dynCall_iiddiddiii = Module["dynCall_iiddiddiii"] = Module["asm"]["ri"]).apply(null, arguments)
};
var dynCall_iiiddidddiii = Module["dynCall_iiiddidddiii"] = function () {
    return (dynCall_iiiddidddiii = Module["dynCall_iiiddidddiii"] = Module["asm"]["si"]).apply(null, arguments)
};
var dynCall_iiiiddidddiiii = Module["dynCall_iiiiddidddiiii"] = function () {
    return (dynCall_iiiiddidddiiii = Module["dynCall_iiiiddidddiiii"] = Module["asm"]["ti"]).apply(null, arguments)
};
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function () {
    return (dynCall_viiiiiii = Module["dynCall_viiiiiii"] = Module["asm"]["ui"]).apply(null, arguments)
};
var dynCall_iifi = Module["dynCall_iifi"] = function () {
    return (dynCall_iifi = Module["dynCall_iifi"] = Module["asm"]["vi"]).apply(null, arguments)
};
var dynCall_iiiji = Module["dynCall_iiiji"] = function () {
    return (dynCall_iiiji = Module["dynCall_iiiji"] = Module["asm"]["wi"]).apply(null, arguments)
};
var dynCall_jiiij = Module["dynCall_jiiij"] = function () {
    return (dynCall_jiiij = Module["dynCall_jiiij"] = Module["asm"]["xi"]).apply(null, arguments)
};
var dynCall_jiiji = Module["dynCall_jiiji"] = function () {
    return (dynCall_jiiji = Module["dynCall_jiiji"] = Module["asm"]["yi"]).apply(null, arguments)
};
var dynCall_v = Module["dynCall_v"] = function () {
    return (dynCall_v = Module["dynCall_v"] = Module["asm"]["zi"]).apply(null, arguments)
};
var dynCall_fiiii = Module["dynCall_fiiii"] = function () {
    return (dynCall_fiiii = Module["dynCall_fiiii"] = Module["asm"]["Ai"]).apply(null, arguments)
};
var dynCall_iiiiiiiiiiiiiifii = Module["dynCall_iiiiiiiiiiiiiifii"] = function () {
    return (dynCall_iiiiiiiiiiiiiifii = Module["dynCall_iiiiiiiiiiiiiifii"] = Module["asm"]["Bi"]).apply(null,
        arguments)
};
var dynCall_fiifi = Module["dynCall_fiifi"] = function () {
    return (dynCall_fiifi = Module["dynCall_fiifi"] = Module["asm"]["Ci"]).apply(null, arguments)
};
var dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] = function () {
    return (dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] = Module["asm"]["Di"]).apply(null, arguments)
};
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function () {
    return (dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = Module["asm"]["Ei"]).apply(null, arguments)
};
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function () {
    return (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = Module["asm"]["Fi"]).apply(null, arguments)
};
var dynCall_viiijj = Module["dynCall_viiijj"] = function () {
    return (dynCall_viiijj = Module["dynCall_viiijj"] = Module["asm"]["Gi"]).apply(null, arguments)
};
var dynCall_iiiiiiidiiddii = Module["dynCall_iiiiiiidiiddii"] = function () {
    return (dynCall_iiiiiiidiiddii = Module["dynCall_iiiiiiidiiddii"] = Module["asm"]["Hi"]).apply(null, arguments)
};
var dynCall_jij = Module["dynCall_jij"] = function () {
    return (dynCall_jij = Module["dynCall_jij"] = Module["asm"]["Ii"]).apply(null, arguments)
};
var dynCall_fiii = Module["dynCall_fiii"] = function () {
    return (dynCall_fiii = Module["dynCall_fiii"] = Module["asm"]["Ji"]).apply(null, arguments)
};
var dynCall_viifi = Module["dynCall_viifi"] = function () {
    return (dynCall_viifi = Module["dynCall_viifi"] = Module["asm"]["Ki"]).apply(null, arguments)
};
var dynCall_viidi = Module["dynCall_viidi"] = function () {
    return (dynCall_viidi = Module["dynCall_viidi"] = Module["asm"]["Li"]).apply(null, arguments)
};
var dynCall_iiijii = Module["dynCall_iiijii"] = function () {
    return (dynCall_iiijii = Module["dynCall_iiijii"] = Module["asm"]["Mi"]).apply(null, arguments)
};
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function () {
    return (dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = Module["asm"]["Ni"]).apply(null, arguments)
};
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = function () {
    return (dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = Module["asm"]["Oi"]).apply(null, arguments)
};
var dynCall_ij = Module["dynCall_ij"] = function () {
    return (dynCall_ij = Module["dynCall_ij"] = Module["asm"]["Pi"]).apply(null, arguments)
};
var dynCall_iiiij = Module["dynCall_iiiij"] = function () {
    return (dynCall_iiiij = Module["dynCall_iiiij"] = Module["asm"]["Qi"]).apply(null, arguments)
};
var dynCall_iiij = Module["dynCall_iiij"] = function () {
    return (dynCall_iiij = Module["dynCall_iiij"] = Module["asm"]["Ri"]).apply(null, arguments)
};
var dynCall_viji = Module["dynCall_viji"] = function () {
    return (dynCall_viji = Module["dynCall_viji"] = Module["asm"]["Si"]).apply(null, arguments)
};
var dynCall_vffff = Module["dynCall_vffff"] = function () {
    return (dynCall_vffff = Module["dynCall_vffff"] = Module["asm"]["Ti"]).apply(null, arguments)
};
var dynCall_vf = Module["dynCall_vf"] = function () {
    return (dynCall_vf = Module["dynCall_vf"] = Module["asm"]["Ui"]).apply(null, arguments)
};
var dynCall_vff = Module["dynCall_vff"] = function () {
    return (dynCall_vff = Module["dynCall_vff"] = Module["asm"]["Vi"]).apply(null, arguments)
};
var dynCall_vfi = Module["dynCall_vfi"] = function () {
    return (dynCall_vfi = Module["dynCall_vfi"] = Module["asm"]["Wi"]).apply(null, arguments)
};
var dynCall_viif = Module["dynCall_viif"] = function () {
    return (dynCall_viif = Module["dynCall_viif"] = Module["asm"]["Xi"]).apply(null, arguments)
};
var dynCall_vif = Module["dynCall_vif"] = function () {
    return (dynCall_vif = Module["dynCall_vif"] = Module["asm"]["Yi"]).apply(null, arguments)
};
var dynCall_viff = Module["dynCall_viff"] = function () {
    return (dynCall_viff = Module["dynCall_viff"] = Module["asm"]["Zi"]).apply(null, arguments)
};
var dynCall_vifff = Module["dynCall_vifff"] = function () {
    return (dynCall_vifff = Module["dynCall_vifff"] = Module["asm"]["_i"]).apply(null, arguments)
};
var dynCall_iidiiii = Module["dynCall_iidiiii"] = function () {
    return (dynCall_iidiiii = Module["dynCall_iidiiii"] = Module["asm"]["$i"]).apply(null, arguments)
};
var _asyncify_start_unwind = Module["_asyncify_start_unwind"] = function () {
    return (_asyncify_start_unwind = Module["_asyncify_start_unwind"] = Module["asm"]["aj"]).apply(null, arguments)
};
var _asyncify_stop_unwind = Module["_asyncify_stop_unwind"] = function () {
    return (_asyncify_stop_unwind = Module["_asyncify_stop_unwind"] = Module["asm"]["bj"]).apply(null, arguments)
};
var _asyncify_start_rewind = Module["_asyncify_start_rewind"] = function () {
    return (_asyncify_start_rewind = Module["_asyncify_start_rewind"] = Module["asm"]["cj"]).apply(null, arguments)
};
var _asyncify_stop_rewind = Module["_asyncify_stop_rewind"] = function () {
    return (_asyncify_stop_rewind = Module["_asyncify_stop_rewind"] = Module["asm"]["dj"]).apply(null, arguments)
};
var _Py_EMSCRIPTEN_SIGNAL_HANDLING = Module["_Py_EMSCRIPTEN_SIGNAL_HANDLING"] = 5168e3;
var ___start_em_js = Module["___start_em_js"] = 5153320;
var ___stop_em_js = Module["___stop_em_js"] = 5153826;

function invoke_iii(index, a1, a2) {
    var sp = stackSave();
    try {
        return dynCall_iii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_iiiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_ii(index, a1) {
    var sp = stackSave();
    try {
        return dynCall_ii(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        dynCall_viiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_iiii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        dynCall_viii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_vii(index, a1, a2) {
    var sp = stackSave();
    try {
        dynCall_vii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    var sp = stackSave();
    try {
        dynCall_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_vi(index, a1) {
    var sp = stackSave();
    try {
        dynCall_vi(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
        return dynCall_iiiiii(index, a1, a2, a3, a4, a5)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_i(index) {
    var sp = stackSave();
    try {
        return dynCall_i(index)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
        dynCall_viiiii(index, a1, a2, a3, a4, a5)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
        dynCall_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_v(index) {
    var sp = stackSave();
    try {
        dynCall_v(index)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_ji(index, a1) {
    var sp = stackSave();
    try {
        return dynCall_ji(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_jiji(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_jiji(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["ccall"] = ccall;
Module["stackTrace"] = stackTrace;
Module["FS"] = FS;
var calledRun;
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller
};

function callMain(args) {
    var entryFunction = Module["_main"];
    args = args || [];
    args.unshift(thisProgram);
    var argc = args.length;
    var argv = stackAlloc((argc + 1) * 4);
    var argv_ptr = argv >> 2;
    args.forEach(arg => {
        HEAP32[argv_ptr++] = allocateUTF8OnStack(arg)
    });
    HEAP32[argv_ptr] = 0;
    try {
        var ret = entryFunction(argc, argv);
        exitJS(ret, true);
        return ret
    } catch (e) {
        return handleException(e)
    }
}

function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return
    }
    preRun();
    if (runDependencies > 0) {
        return
    }

    function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (shouldRunNow) callMain(args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
            setTimeout(function () {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
run();