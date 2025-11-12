import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
...
useLayoutEffect(() => {
  if (isOpen) {
    refreshMessages(user.id).then(() => {
      const chatBody = chatBodyRef.current;
      if (chatBody) {
        // Always scroll to bottom on initial open
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  }
}, [isOpen, user.id, refreshMessages]);
