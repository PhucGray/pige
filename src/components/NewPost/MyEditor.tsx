import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { addDoc, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Editor, RawDraftContentState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { showAlert } from "../../features/alert/alertSlice";
import {
  fetchPostByID,
  fetchPosts,
  selectCurrentPost,
  setCurrentPost,
} from "../../features/post/postSlice";
import { selectUser, setUser } from "../../features/user/userSlice";
import { db, postsCollectionRef } from "../../firebase";
import "../../styles/toolbar.css";
import { PostType } from "../../types";
import { createCombineWords } from "../../utils/generateKeywords";

interface EditorProps {
  action: "add" | "edit";
}

const toolbar = {
  options: [
    "blockType",
    "inline",
    "fontSize",
    "list",
    "textAlign",
    "emoji",
    "image",
    "history",
  ],
  inline: {
    inDropdown: false,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript",
    ],
    bold: {
      icon: "/bold.png",
    },
    italic: { icon: "/italic.png" },
    underline: { icon: "/underline.png" },
    strikethrough: { icon: "/strikethrough.png" },
    monospace: { icon: "/monospace.png" },
    superscript: { icon: "/superscript.png" },
    subscript: { icon: "/subscript.png" },
  },
  emoji: {
    icon: "/emoji.png",
  },
  list: {
    unordered: {
      icon: "/unordered.png",
    },
    ordered: {
      icon: "/ordered.png",
    },
    indent: {
      className: "d-none",
    },
    outdent: {
      className: "d-none",
    },
  },
  textAlign: {
    left: {
      icon: "/left.png",
    },
    right: {
      icon: "/right.png",
    },
    center: {
      icon: "/center.png",
    },
    justify: {
      icon: "/justify.png",
    },
  },
  image: {
    icon: "/image.png",
    alignmentEnabled: false,
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "Blockquote", "Code"],
    className: "blockType",
  },
};

const MyEditor = ({ action }: EditorProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const currentPost = useAppSelector(selectCurrentPost);
  const user = useAppSelector(selectUser);

  const textareaRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const editorRef = useRef() as MutableRefObject<Editor>;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState("");

  function onEditorStateChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  async function handlePost() {
    const content = textareaRef.current.value;

    if (!title.trim())
      return dispatch(
        showAlert({ type: "error", message: "Vui lòng nhập tiêu đề bài viết" }),
      );

    if (!readTime.trim())
      return dispatch(
        showAlert({ type: "error", message: "Vui lòng nhập thời gian đọc" }),
      );

    if (!content.trim())
      return dispatch(
        showAlert({
          type: "error",
          message: "Vui lòng nhập nội dung cho bài viết",
        }),
      );

    const searchKeywords = createCombineWords(title);

    const newPost = {
      uid: user?.uid,
      content: textareaRef.current.value,
      createdAt: new Date().toString(),
      readTime,
      title,
      likes: [],
      comments: [],
      searchKeywords,
    } as PostType;

    const newPostDoc = await addDoc(postsCollectionRef, newPost);

    if (user?.documentID) {
      const userRef = doc(db, "users", user.documentID);
      await updateDoc(userRef, {
        posts: arrayUnion(newPostDoc.id),
      });
    }

    if (user) {
      dispatch(
        setUser({ ...user, posts: [...(user.posts || []), newPostDoc.id] }),
      );
    }

    setEditorState(EditorState.createEmpty());
    setReadTime("");
    setTitle("");

    dispatch(fetchPosts());

    dispatch(showAlert({ type: "success", message: "Thêm bài thành công" }));
  }

  async function handleEdit() {
    const content = textareaRef.current.value;

    if (!title.trim())
      return dispatch(
        showAlert({ type: "error", message: "Vui lòng nhập tiêu đề bài viết" }),
      );

    if (!readTime.trim())
      return dispatch(
        showAlert({ type: "error", message: "Vui lòng nhập thời gian đọc" }),
      );

    if (!content.trim())
      return dispatch(
        showAlert({
          type: "error",
          message: "Vui lòng nhập nội dung cho bài viết",
        }),
      );

    if (!currentPost?.documentID) return;

    const postRef = doc(db, "posts", currentPost.documentID);

    await updateDoc(postRef, {
      content: textareaRef.current.value,
      readTime,
      title,
    });

    setEditorState(EditorState.createEmpty());
    setReadTime("");
    setTitle("");

    dispatch(fetchPosts());
    dispatch(
      showAlert({
        type: "success",
        message:
          action === "add" ? "Thêm bài thành công" : "Sửa bài thành công",
      }),
    );
    navigate("/my-posts");
  }

  // EDIT POST
  useEffect(() => {
    if (action === "edit") {
      const { id } = location.state as { id: string };
      dispatch(fetchPostByID(id));
    }
  }, [location]);

  useEffect(() => {
    if (currentPost && currentPost.documentID) {
      setTitle(currentPost.title);
      setReadTime(currentPost.readTime);
      textareaRef.current.value = currentPost.content;

      const blocksFromHTML = convertFromHTML(currentPost.content);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

      setEditorState(EditorState.createWithContent(state));
    }
  }, [currentPost]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentPost(null));
    };
  }, []);

  //
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focusEditor();

      editorRef.current.componentDidCatch = () => {
        alert("run");
      };
    }
  }, [editorRef]);

  return (
    <div className="h-screen max-h-[100%] overflow-hidden px-[20px] bg-gray-300 flex flex-col">
      {preview && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-shadow z-30">
          <div className="absolute right-[20px] top-[10px] flex justify-center space-x-3 z-30">
            <button
              onClick={() => setPreview(false)}
              className="px-[30px] h-[40px] bg-white text-primary ring-1 ring-primary hover:bg-lightPrimary">
              Tiếp tục {action === "add" ? "viết" : "sửa"}
            </button>
            <button
              onClick={() => {
                action === "add" ? handlePost() : handleEdit();
                setPreview(false);
              }}
              className="px-[40px] h-[40px] bg-primary text-white ring-1 ring-primary hover:bg-darkPrimary hover:ring-darkPrimary">
              {action === "add" ? "Đăng bài" : "Sửa bài"}
            </button>
          </div>

          <div className="bg-white h-full w-screen overflow-auto">
            <div className="w-[90%] mx-auto">
              <div className="mt-[20px] text-[35px] font-semibold mb-[15px]">
                {title}
              </div>

              <Editor
                toolbarHidden
                readOnly
                toolbar={{
                  image: {
                    alignmentEnabled: false,
                  },
                }}
                editorState={editorState}
                hashtag={{
                  separator: " ",
                  trigger: "#",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white flex flex-wrap-reverse justify-between items-center gap-[20px] px-[40px] py-[10px]">
        <input
          type="number"
          min="0"
          onKeyDown={(e) => {
            if (
              ![
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
              ].includes(e.key)
            )
              e.preventDefault();
          }}
          placeholder="Thời gian đọc (phút)"
          className="form-control flex-1 max-w-[185px]"
          value={readTime}
          onChange={(e) => setReadTime(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tiêu đề của bài viêt"
          className="form-control flex-1 max-w-[500px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-x-4 ml-auto">
          <button
            onClick={() => navigate(-1)}
            className="rounded-[5px] w-[120px] h-[40px] text-primary ring-1 ring-primary hover:bg-lightPrimary">
            Thoát
          </button>

          <button
            onClick={() => setPreview(true)}
            className="rounded-[5px] w-[120px] h-[40px] bg-slate-500 text-white ring-1 ring-slate-500 hover:bg-slate-600 hover:ring-slate-600">
            Xem trước
          </button>

          <button
            onClick={action === "add" ? handlePost : handleEdit}
            className="rounded-[5px] w-[120px] h-[40px] bg-primary text-white ring-1 ring-primary hover:bg-darkPrimary hover:ring-darkPrimary">
            {action === "add" ? "Đăng" : "Sửa"}
          </button>
        </div>
      </div>

      <Editor
        wrapperClassName="wrapper bg-white h-full overflow-hidden px-3"
        ref={editorRef}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder="Hãy viết điều gì đó . . . "
        toolbar={toolbar}
        hashtag={{
          trigger: "#",
        }}
      />

      <textarea
        ref={textareaRef}
        className="fixed top-[-100vh] opacity-0"
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
};

export default MyEditor;
