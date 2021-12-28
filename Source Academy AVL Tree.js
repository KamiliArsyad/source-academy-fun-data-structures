/*
-------------- ABOUT THIS PROJECT ----------------
This is a project to create a fully working functional AVL tree, also known as
balanced binary search tree (order: traversal order).
The tree is self-balancing, mutable, and includes all the good interfaces described below.

The tree uses a doubleList data structure (another project; check it out!) to allow bidirectional
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

// CHILDS AND PARENTS ARE ONLY DEFINED USING THIS FUNCTION FOR THE SAKE OF AUGMENTATION
function defineChild(parent, child, position) {
    setParent(child, parent);
    
    if(position === "LEFT") {
        setLeftChild(parent, child);
        update(child);
    } else if(position === "RIGHT") {
        setRightChild(parent, child);
        update(child);
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

//severe the connection of a node from its parent.
function severe(N) {
    const parent = getParent(N);
    
    if(is_rightChild(N)) {
        setRightChild(getParent(N), null);
    } else if(is_leftChild(N)){
        setLeftChild(getParent(N), null);
    }
    
    setParent(N, null);
    update(parent);
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
        ? error(getNodeItem(N), "No predecessor before node: ")
        : subtree_last(getLeftChild(N));
}

//returns the pointer of the node after N in the traversal order
function successor(N){
    return is_leftChild(N) && is_null(getRightChild(N))
        ? getParent(N)
        : is_null(getRightChild(N))
        ? error(getNodeItem(N), "No successor from node: ")
        : subtree_first(getRightChild(N));
}

//returns the depth of a node (distance to root)
function depth(N) {
    function depth_iter(N, res) {
        return is_root(N)
            ? res
            : depth_iter(getParent(N), res + 1);
    }
    
    return depth_iter(N, 0);
}

//returns the height of a node (distance to leaf)
function height(N) {
    //not yet completed
    function height_iter(N, res) {
        if(!is_leaf(N)) {
            // const bigChild = getNodeProp(getRightChild) > getNodeProp(getLeftChild) ? 
        } else {
            res;
        }
    }
}

// MODIFIERS ---------

//swap items between two nodes
function swap(nodeA, nodeB) {
    // const parentA = getParent(nodeA);
    // const parentB = getParent(nodeB);
    
    // const l_childA = getLeftChild(nodeA);
    // const l_childB = getLeftChild(nodeB);
    
    // const r_childA = getRightChild(nodeA);
    // const r_childB = getRightChild(nodeB);
    
    // const propA = getNodeProp(nodeA);
    // const propB = getNodeProp(nodeB);
    
    // not used because too complex but it's ok bcs the concept of
    // pointing nodes individually will no longer be used.
    
    const itemA = getNodeItem(nodeA);
    setNodeItem(nodeA, getNodeItem(nodeB));
    setNodeItem(nodeB, itemA);
}
//insert
function insert_before(newNode, target) {
    if(getLeftChild(target) === null) {
        defineChild(target, newNode, 'LEFT');
    } else {
        defineChild(predecessor(target), newNode, 'LEFT');
    }
    
    // update(newNode);
}

function insert_after(newNode, target) {
    if(getRightChild(target) === null) {
        defineChild(target, newNode, 'RIGHT');
    } else {
        defineChild(successor(target), newNode, 'RIGHT');
    }
    
    update(newNode);
}

//delete
function delete_node(N) {
    //if leaf: Delete. else: recurse through predecessor until leaf.
    if(is_leaf(N)) {
        severe(N);
    } else {
        swap(N, predecessor(N));
        delete_node(N);
    }
}

//rotate
function rotate_AVL(tree) {
    
}

// AUGMENTATION --------
/*
what's augmented: Only number of nodes in a subtree (for now)
*/

//Output a function that receives a function to provide more flexibility later
function combine(propA, propB) {
    return f => f(propA, propB);
}

// update property of all the affected ancestors of a subtree. time: O(h)
function update(st) {
    if(is_single(st)) {
        setNodeProp(st, 1);
    } else if(is_leaf(st)) {
        setNodeProp(st, 1);
        update(getParent(st));
    } else if(is_root(st)) {
        const rightProp = is_null(getRightChild(st)) ? 0 : getNodeProp(getRightChild(st));
        const leftProp = is_null(getLeftChild(st)) ? 0 : getNodeProp(getLeftChild(st));
        
        setNodeProp(st, combine(leftProp, rightProp)((x, y) => x + y + 1));
    } else {
        const rightProp = is_null(getRightChild(st)) ? 0 : getNodeProp(getRightChild(st));
        const leftProp = is_null(getLeftChild(st)) ? 0 : getNodeProp(getLeftChild(st));
        
        setNodeProp(st, combine(leftProp, rightProp)((x, y) => x + y + 1));
        update(getParent(st));
    }
}

//test
const root = createNode(null, 'SECOND ITEM', null);
const right = createNode(null, 'THIRD ITEM', null);
const left = createNode(null, 'FIRST ITEM', null);
defineChild(root, right, 'RIGHT');
defineChild(root, left, 'LEFT');

