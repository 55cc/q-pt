import * as std from 'std';
// import { dir, status } from "./clib/file.so";
import { file } from "./file.js"

// function writeText(src, text, flag) {
// 	var file = std.open(src, flag || 'w');
// 	if (file) {
// 		file.puts(text);
// 		file.close();
// 	} else console.log("error: write in", src);
// }

// function readText(src) {
// 	// if error return null
// 	return std.loadFile(src);
// }



function shortUrl(s) {
	//  remove /+ /$
	s = s.replace(/(\/{2,})/g, "/").replace(/\/$/, "")
	//  remove ./  /./  
	s = s.replace(/^\.\//, "").replace(/\/\.\//g, "/").split("/");
	//  remove ../
	let r = [];
	let len = s.length;
	for (let i = 0; i < len; i++) {
		if (s[i] == "..") {
			r.pop();
		} else {
			r.push(s[i]);
		}
	}
	return r.join("/") + "/";
}
// function mkdir(src, auth) {
// 	try {
// 		return dir(src, auth);
// 	} catch (e) {
// 		console.log("mkdir error", src, e)
// 	}
// }
function access(p, i) {
	return status(p, i || 0);
}
function url(src, root) {
	root = root ? shortUrl(root) : "./";
	src = shortUrl(src);
	let that = {
		dir(...path) {
			return url(src + "/" + path.join("/"), root);
		},
		pwd() {
			return root + src;
		},
		mkdir(name) {
			let path = (root + src).split("/");
			let len = path.length;
			for (let i = 1; i <= len; i++) {
				let p = path.slice(0, 4).join("/") + "/";
				if (access(p) == null) {
					mkdir(p);
				}
			}
			// "./aaa/bbb/bbb/ccc/"
			if (name) {
				name = shortUrl(name);
				mkdir(root + src + name);
			}
		},
		mkfile(name, data) {

		},
		mkfileList(data) {
			(data || []).forEach(v => {
				that.mkfile(v.name, v.data);
			});
		},
		read() {

		},
		status() {

		},
		iifDir(fun) {

		},
		iifFile(fun) {

		},
		ls() {

		},
		watch() {
			//  return promise
		}
	};
	return that;
}


// console.log(url("../../aa/////a/bbb/../ccc").pwd());
// console.log(url("../../aaa/bbb/../ccc/").pwd());
// console.log(url("../../aaa/bbb/../../../ccc").pwd());
// console.log(url("./aaa/bbb/../../../ccc").pwd());
// console.log(url("/aaa/bbb/../../../ccc", "/dev/abc").pwd());
// console.log(url("/aaa/bbb/../../../ccc", "/").pwd());
