let msgpack = require('./msgpack.min.js');
let fs = require('fs')
let token = process.argv[2]
let fileTree: Array<GitSimpleResponse> = []

interface GitSimpleResponse {
    name: string,        //内容名
    path: string,        //路径
    sha: string,         //SHA
    type: string,        //内容类型
    url: string,         //API网址
    html_url: string,    //浏览器网址
    contents: Array<GitSimpleResponse>
}

interface GithubResponse {
    _links: Object,
    download_url: string,
    git_url: string,
    html_url: string,
    name: string,
    path: string,
    sha: string,
    size: number,
    type: string,
    url: string,
    contents: Array<GithubResponse>
}

const simplify = (response: GithubResponse) => {
    return {
        name: response.name,
        path: response.path,
        sha: response.sha,
        type: response.type,
        url: response.url,
        html_url: response.html_url,
        contents: []
    } as GitSimpleResponse
}

const createSubtree = async (parent: GitSimpleResponse) => {
    if (parent.type === "file") return

    parent.contents = []
    await fetch(
        parent.url,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token
        }
        }).then((response) => response.json()).then(async (json) => {
            let contents = json as Array<GithubResponse>
            for await (const content of contents) {
                let simplifiedContent = simplify(content)
                parent.contents.push(simplifiedContent)
                if (content.type === "dir") {
                    await createSubtree(simplifiedContent)
                }
            }
        })
}

console.log("Token:" + token)

//获取root目录信息
fetch("https://api.github.com/repos/Smileslime47/Metion_Archive/contents", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: token
    },
}).then((response) => {
    if (!response.ok) {
        console.log("Http Response Not Ok.")
    }
    return response.json()
}).then(async (json) => {
    let contents = json as Array<GithubResponse>
    contents.forEach((content: GithubResponse, _: any) => {
        fileTree.push(simplify(content))
    })


    await Promise.all(fileTree.map(async (content) => {
        await createSubtree(content)
    }))

    // fileTree.forEach((content: GitSimpleResponse, _: any) => {
    //     console.log(content.contents)
    // })
    // console.log(msgpack.serialize(fileTree))
    // let test = msgpack.deserialize(msgpack.serialize(fileTree))
    // test.forEach((content: GitSimpleResponse, _: any) => {
    //     console.log(content.contents)
    // })
    console.log(msgpack.serialize(fileTree) as Uint8Array)
    fs.writeFile('./archive.tree', msgpack.serialize(fileTree) as Uint8Array, (err: any) => {
        if (err) {
            console.log("Write Failed")
        } else {
            console.log("Write Success")
        }
    })
})


