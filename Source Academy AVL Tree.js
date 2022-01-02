/*
-------------- ABOUT THIS PROJECT ----------------
This is a project to create a fully working functional AVL tree, also known as
balanced binary search tree (order: traversal order).
The tree is self-balancing, mutable, and includes all the good interfaces described below.

The tree uses a doubleList data structure (another project; check it out!) to allow bidirectional
parent-child access.
*/


//now that it's completed, here's some basic interfaces for you to try stuff out:
/*
1. build a balanced binary tree from array in O(n*logn) time: build(arr);
2. create an individual node: createNode(null, item, null);
3. get right/right child: getRightChild(node); or getLeftChild(node);
4. get parent: getParent(node);
5. basic is_something operation: you know what it is.
6. get an item from a node: getNodeItem(node);
7. ... many more functionalities and interfaces; see below!

when we build a tree, the 'tree' we are referring to is the root node of that tree.

note: use 'let' to declare a variable that points to a tree because some operations
might change the tree's root and you need to re-declare your root position.
example:
let tree = build([1,2,3]);
..modify stuff here...
tree = getRoot(tree); //maintain root. This won't be possible if you use const.

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
------------------------------------------
           Binary Search Tree
------------------------------------------
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

// ---------------------------- SPECIAL FUNCTION -------------------------------------
// define a child of a parent: includes managing all pointers and augmentations
// CAUTION: ONLY DEFINE CHILDS AND PARENTS USING THIS FUNCTION FOR THE SAKE OF AUGMENTATION
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
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

//slightly more advanced interfaces

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

function getRoot(N) {
    return is_root(N)
        ? N
        : getRoot(getParent(N));
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

//returns the pointer of the node before N in the traversal order of the tree
function predecessor(N){ //bug fixed
    if(!is_null(getLeftChild(N))) {
        return subtree_last(getLeftChild(N));
    } else {
        let pointer = N;
        while(is_leftChild(pointer)) {
            pointer = getParent(pointer);
        }
        
        return getParent(pointer);
    }
}

//returns the pointer of the node after N in the traversal order of the tree
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
/*
function height(N) {
    return is_null(N)
        ? 0
        : is_leaf(N)
        ? 1
        : 1 + math_max(height(getRightChild(N)), height(getLeftChild(N)));
}
*/

//solution 2: O(1) time (augment the height)
function height(N) {
    return is_null(N)
        ? 0
        : getNodeProp(N);
}

//returns the skewness of a tree
function skew(tree) {
    return height(getRightChild(tree)) - height(getLeftChild(tree));
}

//checks if a binary tree is balanced; if so, return true.
const is_balanced = tree => math_abs(skew(tree)) === 1 || math_abs(skew(tree)) === 0;

// ------------------------
// TREE MODIFIERS ---------
// ------------------------
// note: augmentation handled automatically in these functions because we use the defineChild function


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

//insertion !!not yet upgraded to maintain balance
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

//deletes item from node N while maintaining everything !! won't work if !is_leaf(tree) and there's no predecessor
function deleteItem(N) {
    //if leaf: Delete. else: recurse swap through predecessor until leaf.
    if(is_leaf(N)) {
        const parent = getParent(N);
        severe(N);
        balance(parent);
    } else {
        swap(N, predecessor(N));
        deleteItem(predecessor(N));
    }
}

//rotate the AVL tree !! keep in mind this might change the pointer of the root !!
function rightRotate(tree) {
    const parent = getParent(tree);
    const subtree_root = tree;
    const direction = is_null(subtree_root) ? null : is_leftChild(subtree_root) ? 'LEFT' : 'RIGHT';//which child the subtree_root was
    const leftSubtree = getLeftChild(tree);
    const rightGrandChild = is_null(leftSubtree) ? null : getRightChild(leftSubtree);
    
    if(!is_null(rightGrandChild)) {
        severe(rightGrandChild);
    }
    
    if(!is_null(leftSubtree)){
        severe(leftSubtree);
        
        if(!is_null(parent)) {
            defineChild(parent, leftSubtree, direction);
        }
        
        defineChild(leftSubtree, subtree_root, 'RIGHT');
        defineChild(subtree_root, rightGrandChild, 'LEFT');
    }
    
    
    
}

function leftRotate(tree) {
    const parent = getParent(tree);
    const subtree_root = tree;
    const direction = is_null(subtree_root) ? null : is_leftChild(subtree_root) ? 'LEFT' : 'RIGHT';
    const rightSubtree = getRightChild(tree);
    const leftGrandChild = is_null(rightSubtree) ? null : getLeftChild(rightSubtree);
    
    if(!is_null(leftGrandChild)){
        severe(leftGrandChild);
    }
    
    if(!is_null(rightSubtree)) {
        severe(rightSubtree);
        
        if(!is_null(parent)) {
            defineChild(parent, rightSubtree, direction);
        }
        
        defineChild(rightSubtree, subtree_root, 'LEFT');
        defineChild(subtree_root, leftGrandChild, 'RIGHT');
    }
    
}

// AUGMENTATION --------
/*
what's augmented: either height of or number of elements in a subtree (for now)
*/

//Output a function that receives an augmentation function to provide more flexibility later
function combine(propA, propB) {
    return f => f(propA, propB);
}

//augmentation function
const heightUpdate = (x, y) => x > y ? x + 1 : y + 1;
const numUpdate = (x, y) => x + y + 1;

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
        
        setNodeProp(st, combine(leftProp, rightProp)(heightUpdate));
    } else {
        const rightProp = is_null(getRightChild(st)) ? 0 : getNodeProp(getRightChild(st));
        const leftProp = is_null(getLeftChild(st)) ? 0 : getNodeProp(getLeftChild(st));
        
        setNodeProp(st, combine(leftProp, rightProp)(heightUpdate));
        update(getParent(st));
    }
}

// ------------
// TREE BALANCING
// ------------
// balance a tree from a leaf to its ancestors in O(h) = O(log(n))
function balance(node) {
    /*
    1. From leaf, trace ancestors until lowest unbalanced tree is found
    2. fix using either of three cases
    3. continue tracing and fixing ancestors
    */
    //given a lowest unbalanced tree, fix it so that it is balanced
    function fix(tree){
        const skewness = skew(tree);
        
        if(skewness > 0) { //right child bigger than left child by two
            const R = getRightChild(tree);
            if(skew(R) === 1 || skew(R) === 0) {
                leftRotate(tree);
            } else {
                rightRotate(R);
                leftRotate(tree);
            }
        } else {
            const L = getLeftChild(tree);
            if(skew(L) === 0 || skew(L) === -1) {
                rightRotate(tree);
            } else {
                leftRotate(L);
                rightRotate(tree);
            }
        }
    }
    
    for(let pointer = node; !is_null(pointer); pointer = getParent(pointer)) {
        if(!is_balanced(pointer)) {
            fix(pointer);
        }
    }
}

//Insert a node with element item to the end of the traversal order in a tree while maintaining balance
function insert_end(item, tree) {
    if(is_null(successor(tree))) {
        insert_after(createNode(null, item, null), tree);
        balance(tree);
    } else {
        insert_end(item, successor(tree));
    }
}


//build a balanced binary tree
function build(arr) {
    let res = createNode(null, arr[0], null);
    
    for(let i = 1; i < array_length(arr); i = i + 1) {
        insert_end(arr[i], res);
        display(arr[i], 'INSERTING VALUE:');
    }
    
    display('BUILD FINISHED');
    return getRoot(res);
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
solution: don't do it.

bug found in left and right rotate: Cases where the nodes involved in rotation are null. Not yet fixed. Gonna sleep now.
update 02/01/2022: bug fixed.
*/
