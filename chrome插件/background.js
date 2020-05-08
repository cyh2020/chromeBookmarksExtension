
function init() {
    let root = document.getElementById("app");
    root.addEventListener("dragstart", dragstartListener)
    root.addEventListener("dragenter", e => e.preventDefault())
    root.addEventListener("dragover", e => e.preventDefault())
    root.addEventListener("drop", dropListener)
    root.addEventListener("click", shiftClickListener)
    reDraw(root);

    //navigator
    let root2 = document.getElementById("navigator");
    root2.addEventListener("dragstart", dragstartListener)
    root2.addEventListener("dragenter", e => e.preventDefault())
    root2.addEventListener("dragover", e => e.preventDefault())
    root2.addEventListener("drop", dropListener)
    root2.addEventListener("click", shiftClickListener)
    reDraw(root2);
}

function reDraw(root) {
    [...root.children].forEach((n) => {
        root.removeChild(n)
    })
    chrome.bookmarks.getTree(function (bookmarkArray) {
        // console.log(bookmarkArray);
        showTree(root, bookmarkArray);
    });

}


function showTree(root, tree) {
    
    if (root.id==="navigator"){
        //navigator
        level_order_transversal2(tree[0], root, 0)
    }else{
        level_order_transversal(tree[0], root, 0)
    }
    
}

function level_order_transversal(node, fa_dom_node, level) {
    if (node.hasOwnProperty("url")) {//节点
        // console.log(node.title.substr(0, 10) + node.url + node.id);
        addDom(fa_dom_node, node, level);
    } else {
        // console.log(node.title + node.id);
        let thisDom = addDom(fa_dom_node, node, level);
        if (node.children.length !== 0) {
            node.children.forEach(element => {
                level_order_transversal(element, thisDom, level + 1);
            });
        }
    }
}

function level_order_transversal2(node, fa_dom_node, level) {
    console.log(node.title)
    if (node.hasOwnProperty("url")) {//节点
        console.log(node.url)
    } else {
        // console.log(node.title + node.id);
        let thisDom = addDom(fa_dom_node, node, level);
        if (node.children.length !== 0) {
            node.children.forEach(element => {
                level_order_transversal2(element, thisDom, level + 1);
            });
        }
    }
}

//addDom
function addDom(root, ele, level) {
    let child = document.createElement('div');
    // child.innerHTML = ele.title.substr(0, 10) + " " + ele.id;

    child.innerHTML = ele.title.substr(0, 18);
    child.id = ele.id;
    child.draggable = "true";
    if (ele.hasOwnProperty("url")) {//leaf
        child.setAttribute("class", "level" + level + " leaf");
        child.title = "leaf"
    } else {
        child.setAttribute("class", "level" + level);
    }

    root.appendChild(child)
    return child;
}

let waitList = [];
let preClick = undefined;
let preParentNode = undefined;

//dragstart
function dragstartListener(e) {
    // e.preventDefault();
    if (waitList.length <= 1) {//waitList is empty
        //cancel prev select
        waitList = [];
        preClick = undefined;
        preParentNode = undefined;

        waitList.push(e.target.id);
    }

}

//drop
function dropListener(e) {
    e.preventDefault();

    console.log(waitList)

    let dataFrom = waitList;
    let dataTo = undefined;;

    //find toNode Father
    let candidateNodes = e.path;
    // console.log(candidateNodes)
    for (let i = 0; i < candidateNodes.length; i++) {
        if (candidateNodes[i].title !== "leaf") {//不是节点
            dataTo = candidateNodes[i].id;
            break;
        }
    }


    if (dataTo === "0") {
        console.assert(dataTo !== "0");
    } else {
        dataFrom.forEach((n) => {
            MoveNode(n, dataTo);
        })
    }

    waitList = [];
    let root1 = document.getElementById("app");
    let root2 = document.getElementById("navigator");
    reDraw(root1);
    reDraw(root2);
}


function shiftClickListener(e) {
    let parentNode = e.path[1];

    // if (e.shiftKey) {
        if (preClick) {//prev exist
            if (parentNode === preParentNode) {
                //clear prev
                let preNode = preClick;
                

                let children = [...parentNode.children];
                let index1 = children.indexOf(preNode);
                let index2 = children.indexOf(e.target);

                let iMin = Math.min(index1, index2)
                let iMax = Math.max(index1, index2)

                waitList = [];
                for (i = iMin; i <= iMax; i++) {
                    waitList.push(children[i].id)
                }
                console.log(waitList)

                //cancel prev
                preClick = undefined;
                preParentNode = undefined;
            } else {
                console.log("nodes must under the same parent")
            }
        } else {
            preClick = e.target;
            preParentNode = parentNode;
        }
    // }
}

function MoveNode(fromNode, toNode) {
    //某个节点的子树
    chrome.bookmarks.getSubTree(fromNode, (n) => {

    })

    const dest = {
        parentId: toNode
    }
    chrome.bookmarks.move(fromNode, dest)

}



init();

