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
    if(!is_null(child)) {
        setParent(child, parent);
    }
    
    if(position === "LEFT") {
        if(!is_null(getLeftChild(parent))) {
            setParent(getLeftChild(parent), null);
        }
        
        setLeftChild(parent, child);
        
        if(is_null(child)) {
            update(parent);
        } else {
            update(child);
        }
    } else if(position === "RIGHT") {
        if(!is_null(getRightChild(parent))) {
            setParent(getRightChild(parent), null);
        }
        
        setRightChild(parent, child);
        
        if(is_null(child)) {
            update(parent);
        } else {
            update(child);
        }
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
    return is_leaf(N) || is_null(getLeftChild(N))
        ? N
        : subtree_first(getLeftChild(N));
}

function subtree_last(N) {
    return is_leaf(N) || is_null(getRightChild(N))
        ? N
        : subtree_last(getRightChild(N));
}

//returns the pointer of the node before N in the traversal order
function predecessor(N){ // this is probably faulty too; gotta check later
    return is_rightChild(N) && is_null(getLeftChild(N))
        ? getParent(N)
        : is_null(getLeftChild(N))
        ? null
        : subtree_last(getLeftChild(N));
}

//returns the pointer of the node after N in the traversal order
function successor(N) { //bug fixed
    if(!is_null(getRightChild(N))) {
        return subtree_first(getRightChild(N));
    } else {
        let pointer = N;
        while(is_rightChild(pointer)) {
            pointer = getParent(pointer);
        }
        
        return getParent(pointer);
    }
}

//returns an array consisting of all the elements of the tree in traversal order
function traverse(tree) {
    const result = [];
    let pointer = subtree_first(tree);
    
    for(let i = 0; !is_null(pointer); i = i + 1) {
        result[i] = getNodeItem(pointer);
        pointer = successor(pointer);
    }
    
    return result;
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
//solution 1 (used here): O(n) time
//solution 2 (not yet implemented): O(1) time (augment the height)
function height(N) {
    return is_null(N)
        ? 0
        : is_leaf(N)
        ? 1
        : 1 + math_max(height(getRightChild(N)), height(getLeftChild(N)));
}

//skew
function skew(tree) {
    return height(getRightChild(tree)) - height(getLeftChild(tree));
}

//checks if a binary tree is balanced
const is_balanced = tree => math_abs(skew(tree)) === 1 || math_abs(skew(tree)) === 0;

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
        defineChild(predecessor(target), newNode, 'RIGHT');
    }
}

function insert_after(newNode, target) {
    if(getRightChild(target) === null) {
        defineChild(target, newNode, 'RIGHT');
    } else {
        defineChild(successor(target), newNode, 'LEFT');
    }
}

//severe the connection of a leaf from its parent.
function severe(N) {
    const parent = getParent(N);
    
    if(is_rightChild(N)) {
        defineChild(parent, null, 'RIGHT');
    } else if(is_leftChild(N)){
        defineChild(parent, null, 'LEFT');
    }
}

//delete
function delete_node(N) {
    //if leaf: Delete. else: recurse swap through predecessor until leaf.
    if(is_leaf(N)) {
        severe(N);
    } else {
        swap(N, predecessor(N));
        delete_node(predecessor(N));
    }
}

//rotate the AVL tree
function rightRotate(tree) {
    const parent = getParent(tree);
    const subtree_root = tree;
    const direction = is_null(subtree_root) ? null : is_leftChild(subtree_root) ? 'LEFT' : 'RIGHT';//which child the subtree_root was
    const leftSubtree = getLeftChild(tree);
    const rightGrandChild = is_null(leftSubtree) ? null : getRightChild(leftSubtree);
    
    severe(rightGrandChild);
    severe(leftSubtree);
    
    if(!is_null(parent)) {
        defineChild(parent, leftSubtree, direction);
    }
    
    defineChild(leftSubtree, subtree_root, 'RIGHT');
    defineChild(subtree_root, rightGrandChild, 'LEFT');
    
}

function leftRotate(tree) {
    const parent = getParent(tree);
    const subtree_root = tree;
    const direction = is_null(subtree_root) ? null : is_leftChild(subtree_root) ? 'LEFT' : 'RIGHT';
    const rightSubtree = getRightChild(tree);
    const leftGrandChild = is_null(rightSubtree) ? null : getLeftChild(rightSubtree);
    
    severe(leftGrandChild);
    severe(rightSubtree);
    
    if(!is_null(parent)) {
        defineChild(parent, rightSubtree);
    }
    
    defineChild(rightSubtree, subtree_root, 'LEFT');
    defineChild(subtree_root, leftGrandChild, 'RIGHT');
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
// Please mind that we can't use this method here to build our tree.
// To build our tree, the nodes should be created anonymously because of how the function swap() works.
const root = createNode(null, 'SECOND ITEM', null);
const right = createNode(null, 'THIRD ITEM', null);
const left = createNode(null, 'FIRST ITEM', null);
defineChild(root, right, 'RIGHT');
defineChild(root, left, 'LEFT');

const checkRight = x => getNodeItem(getRightChild(x));
const checkLeft = x => getNodeItem(getLeftChild(x));
const checkParent = x => getNodeItem(getParent(x));


//log
/*
bug found when defining a grandchild of a root as a child using defineChild(): Stuff entangles around.
*/
