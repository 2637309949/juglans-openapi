# juglans-openapi
    插件涉及的算法 RSA PKCS#1, 哈希使用SHA256
## 参数
    app_id         String           是     分配给开发者的应用ID
    method         String           是     接口名称 xxx.xxx.xx.xx
    format         String           否     仅支持JSON JSON
    return_url     String           否     HTTP/HTTPS开头字符串 https://xx.xx.com/xx
    charset        String           是     请求使用的编码格式，如utf 8,gbk,gb2312等 utf 8
    sign_type      String           是     生成签名字符串所使用的签名算法类型，RSA2和RSA，目前RSA
    sign           String           是     请求参数的签名串
    timestamp      String           是     发送请求的时间，格式"yyyy MM dd HH:mm:ss" 2014 07 24 03:07:50
    version        String           是     调用的接口版本，固定为：1.0 1.0
    notify_url     String           否     服务器主动通知商户服务器里指定的页面http/https路径。
    app_auth_token String           否     应用授权
    biz_content    String           是     请求参数的集合，最大长度不限，除公共参数外所有请求参数都必须放在这个参数中传递
## Example

## MIT License

Copyright (c) 2018-2020 Double

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
