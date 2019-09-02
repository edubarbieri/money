import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE, SET_LOADING, SET_REFRESH } from 'store/globalActions';
import bundle, { bundleFormat } from 'i18n/bundle';
import route from 'i18n/route';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import 'sass/categoryTree';
import Modal from 'components/modal/Modal';
import CategoryEditor from './CategoryEditor';
import { category as categoryService } from 'mymoney-sdk';
import Errors from 'components/message/Error';
import SelectWalletMessage from 'components/global/SelectWalletMessage';
import { SET_CATEGORIES } from 'store/walletActions';

const CategoryMaintenance = () => {
    const dispatch = useDispatch();
    dispatch({ type: SET_ACTIVE_PAGE, payload: route('maintenance.category') })
    let started = useSelector(state => state.global.started);
    let refresh = useSelector(state => state.global.refresh);
    let wallet = useSelector(state => state.user.activeWallet);
    let [errors, setErrors] = useState([]);

    useEffect(() => {
        if ((!wallet || !wallet.id) || (!started && refresh.type !== 'category')) {
            return;
        }
        dispatch({ type: SET_LOADING, payload: true });

        categoryService.getAll().then(result => {
            if (result.status >= 400) {
                dispatch({ type: SET_LOADING, payload: false });
                setErrors(result.errors);
                return;
            }
            setErrors([]);
            setCategoryTree(result);
            dispatch({ type: SET_LOADING, payload: false });
        }).catch(err => {
            console.log(err);
            dispatch({ type: SET_LOADING, payload: false });
        })

        categoryService.getWithPath().then(result => {
            if(result.status >= 400){
                console.log('Error on fetch categories');
                return;
            }
            dispatch({ type: SET_CATEGORIES, payload: result});
        }).catch(err => {
            console.log(err)
        });
    }, [started, dispatch, refresh, wallet])


    const [categoryTree, setCategoryTree] = useState(null);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [modalConfirmationData, setModalConfirmationData] = useState({
        title: '',
        text: '',
        onConfirm: null,
        onCancel: null,
        category: null
    });

    const [showModalEditor, setShowModalEditor] = useState(false);
    const [modalEditorData, setModalEditorData] = useState({
        onConfirm: null,
        onCancel: null,
        category: null
    });

    const pages = [{
        label: bundle('maintenance.category')
    }]

    const cancelConfirmation = () => {
        setShowModalConfirmation(false);
    }

    const cancelEditor = () => {
        setShowModalEditor(false);
    }

    const handleEditRow = (category) => {
        setModalEditorData({
            onConfirm: callbackEditCategory,
            onCancel: cancelEditor,
            category: category
        });
        setShowModalEditor(true);
    }

    const handleCreateRow = (categoryHint) => {
        setModalEditorData({
            onConfirm: callbackCreateCategory,
            onCancel: cancelEditor,
            category: {
                parentId: categoryHint.id || null,
                id: new Date().getTime()
            }
        });
        setShowModalEditor(true);
    }

    const handleRemoveRow = (categoryHint) => {
        setModalConfirmationData({
            title: bundle('remove.category'),
            text: bundleFormat('remove.category.confirmation', categoryHint.title),
            onConfirm: callbackRemoveConfirmation,
            onCancel: cancelConfirmation,
            category: categoryHint
        });
        setShowModalConfirmation(true);
    }

    const callbackRemoveConfirmation = (category) => {
        setShowModalConfirmation(false);
        
        dispatch({ type: SET_LOADING, payload: true });
        categoryService.remove(category.id).then(result => {
            dispatch({ type: SET_REFRESH, payload: {type: 'category', value: new Date().getTime()}});
        }).catch(err => {
            dispatch({ type: SET_LOADING, payload: false });
            console.error(err);
        })
    }

    const callbackEditCategory = (data) => {
        if (!data) {
            return;
        }
        setShowModalEditor(false);
        dispatch({ type: SET_LOADING, payload: true });
        categoryService.update(data.id, data.title, data.parentId || null, data.keywords).then(result => {
            dispatch({ type: SET_REFRESH, payload: {type: 'category', value: new Date().getTime()}});
        }).catch(err => {
            dispatch({ type: SET_LOADING, payload: false });
            console.error(err);
        })
    }

    const callbackCreateCategory = (data) => {
        if (!data) {
            return;
        }
        setShowModalEditor(false);
        dispatch({ type: SET_LOADING, payload: true });
        categoryService.create(data.title, data.parentId || null, data.keywords).then(result => {
            dispatch({ type: SET_REFRESH, payload: {type: 'category', value: new Date().getTime()}});
        }).catch(err => {
            dispatch({ type: SET_LOADING, payload: false });
            console.error(err);
        })
    }

    const updateParent = (currentNode, parentNode) =>{
        let parentId = null;
        if(parentNode){
          parentId = parentNode.id;
        }
        categoryService.setParent(currentNode.id, parentId).then(result => {
            dispatch({ type: SET_REFRESH, payload: {type: 'category', value: new Date().getTime()}});
        }).catch(err => {
            dispatch({ type: SET_LOADING, payload: false });
            console.error(err);
        })
      }
    

    const renderRowOptions = (rowData) => {
        return ({
            buttons: [
                <div className="row-options edit"
                    onClick={() => handleEditRow(rowData.node)}>
                    <i className="far fa-edit"></i>
                </div>,
                <div className={(rowData.node.children && rowData.node.children.length) ? 'row-options remove hidden' : 'row-options remove'}
                    onClick={() => handleRemoveRow(rowData.node)}>
                    <i className="far fa-trash-alt"></i>
                </div>,
                <div className="row-options plus"
                    onClick={() => handleCreateRow(rowData.node)}>
                    <i className="far fa-plus-square"></i>
                </div>
            ]
        })
    };

    const renderConfirmation = () => {
        if (showModalConfirmation) {
            return (
                <Modal
                    text={modalConfirmationData.text}
                    title={modalConfirmationData.title}
                    size=""
                    fixed={true}
                    onConfirm={() => modalConfirmationData.onConfirm(modalConfirmationData.category)}
                    onClose={() => modalConfirmationData.onCancel(modalConfirmationData.category)}
                    onCancel={() => modalConfirmationData.onCancel(modalConfirmationData.category)}
                />
            )
        }
    }

    const renderCategoryEditor = () => {
        if (showModalEditor) {
            return (
                <CategoryEditor
                    onCancel={modalEditorData.onCancel}
                    onConfirm={modalEditorData.onConfirm}
                    category={modalEditorData.category}
                />
            )
        }
    }

    return (
        <div>
            <SelectWalletMessage />
            {errors && <Errors errors={errors} setErrors={setErrors}/>}
            {renderConfirmation()}
            {renderCategoryEditor()}
            <h1 className="page-title">{bundle('maintenance.category')}</h1>
            <Breadcrumb pages={pages} />
            <div className="button-with-icon" onClick={() => handleCreateRow('')}>
                <i className="fa fa-plus"></i>
                {bundle('add.root.category')}
            </div>
            {categoryTree &&
                <SortableTree
                    treeData={categoryTree}
                    onChange={setCategoryTree}
                    onMoveNode={({ node, nextParentNode }) => updateParent(node, nextParentNode)}
                    getNodeKey={({ node }) => node.id}
                    isVirtualized={false}
                    generateNodeProps={renderRowOptions}
                />
            }
        </div>
    );
}

export default CategoryMaintenance;