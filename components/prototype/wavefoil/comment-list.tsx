"use client";

/**
 * The recent comments, newest first, on the Explore page. Each row is a thread:
 * who wrote last, what the thread is about, a line of what they said and when.
 * A thread that has not been opened yet is set in bold with a dot beside it.
 */

import { ObiChevronRightGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-chevron-right-google";
import { formatWhen, lastMessage, recentThreads, type Thread } from "./explore-data";
import styles from "./training.module.css";

/** "Foil controls thread" is listed as "Foil controls". */
function subject(thread: Thread) {
  return thread.subject ?? thread.title.replace(/ thread$/, "");
}

export function CommentList({
  threads,
  onOpen,
}: {
  threads: Thread[];
  onOpen: (id: string) => void;
}) {
  const rows = recentThreads(threads);

  return (
    <ul className={styles.commentList}>
      {rows.map((thread) => {
        const last = lastMessage(thread)!;
        const when = formatWhen(last.at);
        return (
          <li key={thread.id}>
            <button
              type="button"
              className={`${styles.comment} ${thread.unread ? styles.commentUnread : ""}`}
              onClick={() => onOpen(thread.id)}
            >
              {thread.unread ? <span className={styles.commentDot} aria-label="Unread" /> : null}
              <span className={styles.commentAvatar}>{last.author}</span>
              <span className={styles.commentText}>
                <span className={styles.commentTitle}>{subject(thread)}</span>
                <span className={styles.commentPreview}>{last.text}</span>
              </span>
              <span className={styles.commentWhen}>
                <span className={styles.commentDate}>{when.date}</span>
                <span>{when.time}</span>
              </span>
              <ObiChevronRightGoogle className={styles.commentChevron} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
