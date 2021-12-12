/*
-------------- ABOUT THIS PROJECT ----------------
This is a project to create a fully working functional AVL tree, also known as
balanced binary search tree (traversal order).
The tree is self-balancing, mutable, and includes all the good interfaces described below.

The tree uses a doubleList data structure (another project) to allow bidirectional
parent-child access.
*/

// --------------------------------------------------------------------------------------
// DOUBLE LIST DATA STRUCTURE
// --------------------------------------------------------------------------------------

//interfaces
const triplet = (x, y, z) => [x, y, z];
const getItem = triplet => triplet[1];
const prevNode = triplet => triplet[0];
const nextNode = triplet => triplet[2];
const setNext = (triplet, x) => {triplet[2] = x;};
const setItem = (triplet, x) => {triplet[1] = x;};
const setPrev = (triplet, x) => {triplet[0] = x;};

function dL_ref(dlst, n) {
    return n === 0
        ? getItem(dlst)
        : dL_ref(nextNode(dlst), n-1);
}

function dL_map(f, dlst) {
    function creator(dlst, prev) {
        if(is_null(dlst)) {
            return null;
        } else {
            const result = triplet(prev, f(getItem(dlst)), null);
            const next = creator(nextNode(dlst), result);
            setNext(result, next);
            
            return result;
        }
    }
    
    return creator(dlst, null);
}

/*
Definition:
A doubleList is either a null, or a triplet whose head (prevNode) a doubleList and whose
tail (nextNode) is a doubleList.
*/
function doubleList(lst) {
    function creator(lst, prev) {
        if(is_null(lst)) {
            return null;
        } else {
            const result = triplet(prev, head(lst), null);
            const next = creator(tail(lst), result);
            setNext(result, next);
            
            return result;
        }
    }
    
    return creator(lst, null);
}
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------


/*
------------------------------------
        Binary Search Tree
------------------------------------
*/

// structure format: doubleList(list(parent, left_child, [item, props], right_child))
// basic interfaces
const createNode = (parent, item, props) => doubleList(list(parent, null, [item, props], null));
const getParent = node => getItem(node);
const getNodeItem = node => getItem(nextNode(nextNode(node)))[0];
const getNodeProp = node => getItem(nextNode(nextNode(node)))[1];
const getLeftChild = node => getItem(nextNode(node));
const getRightChild = node => getItem(nextNode(nextNode(nextNode(node))));

const setParent = (node, parent) => setItem(node, parent);
const setNodeItem = (node, item) => {getItem(nextNode(nextNode(node)))[0] = item;};
const setNodeProp = (node, prop) => {getItem(nextNode(nextNode(node)))[1] = prop;};
const setLeftChild = (node, child) => setItem(nextNode(node), child);
const setRightChild = (node, child) => setItem(nextNode(nextNode(nextNode(node))), child);

//slightly more advanced interfaces

function defineChild(parent, child, position) {
    setParent(child, parent);
    
    if(position === "LEFT") {
        setLeftChild(parent, child);
    } else if(position === "RIGHT") {
        setRightChild(parent, child);
    } else {
        error(position, 'unsupported string position:');
    }
}

function is_root(N) {
    return is_null(getParent(N));
}

function is_leftChild(N) {
    return is_root(N)
        ? false
        : getLeftChild(getParent(N)) === N;
}

function is_rightChild(N) {
    return is_root(N)
        ? false
        : getRightChild(getParent(N)) === N;
}

function is_sibling(N1, N2) {
    return is_root(N1) || is_root(N2)
        ? false
        : getParent(N1) === getParent(N2);
}

function ancestors(N) {
    const result = [];
    let pointer = N;
    let count = 0;
    
    while(!is_root(pointer)) {
        result[count] = getNodeItem(getParent(N));
        pointer = getParent(N);
        count = count + 1;
    }
    
    return result;
}

function is_leaf(N) {
    return is_null(getLeftChild(N)) && is_null(getRightChild(N));
}

function is_single(N) {
    return is_leaf(N) && is_root(N);
}

function subtree_first(N) {
    return is_leaf(N)
        ? N
        : subtree_first(getLeftChild(N));
}

function subtree_last(N) {
    return is_leaf(N)
        ? N
        : subtree_last(getRightChild(N));
}

//returns the pointer of the node before N in the traversal order
function predecessor(N){
    return is_rightChild(N) && is_null(getLeftChild(N))
        ? getParent(N)
        : is_null(getLeftChild(N))
        ? error(getNodeItem(N), "No predecessor detected before ")
        : subtree_last(getLeftChild(N));
}

//returns the pointer of the node after N in the traversal order
function successor(N){
    return is_leftChild(N) && is_null(getRightChild(N))
        ? getParent(N)
        : is_null(getRightChild(N))
        ? error(getNodeItem(N), "This is already the last node:")
        : subtree_first(getRightChild(N));
}


//test
const root = createNode(null, 'SECOND ITEM', null);
const right = createNode(null, 'THIRD ITEM', null);
const left = createNode(null, 'FIRST ITEM', null);
defineChild(root, right, 'RIGHT');
defineChild(root, left, 'LEFT');

