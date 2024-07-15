import { fabric } from 'fabric'

export function boundaryLimit(moveObj: fabric.Object, canvas: fabric.Canvas) {
  moveObj.setCoords();
  if (moveObj.left !== undefined) {
    if (moveObj.getBoundingRect().left < 0) {
      // moveObj.left = 0
      moveObj.left = Math.max(moveObj.left, moveObj.left - moveObj.getBoundingRect().left);
    } else if (moveObj.getBoundingRect().left + moveObj.getBoundingRect().width > canvas.getWidth()) {
      // moveObj.left = canvas.getWidth() - 200;
      moveObj.left = Math.min(
        moveObj.left,
        canvas.getWidth() - moveObj.getBoundingRect().width + moveObj.left - moveObj.getBoundingRect().left,
      );
    }
  }

  if (moveObj.top !== undefined) {
    if (moveObj.getBoundingRect().top < 0) {
      // moveObj.top = 0;
      moveObj.top = Math.max(moveObj.top, moveObj.top - moveObj.getBoundingRect().top);
    } else if (moveObj.getBoundingRect().top + moveObj.getBoundingRect().height > canvas.getHeight()) {
      // moveObj.top = canvas.getHeight() - 200;
      moveObj.top = Math.min(
        moveObj.top,
        canvas.getHeight() - moveObj.getBoundingRect().height + moveObj.top - moveObj.getBoundingRect().top,
      );
    }
  }
}

/**
 * 辅助
 */
export function initAligningGuidelines(canvas: fabric.Canvas) {
  let ctx = canvas.getSelectionContext(), // getSelectionContext 获取选择上下文
      aligningLineOffset = 5, // 对齐线条偏移
      aligningLineMargin = 4, // 对齐线边距
      aligningLineWidth = 1, // 对齐线条宽度
      aligningLineColor = '#FF0707', // 颜色
      viewportTransform: any, // 视图端口转换
      zoom = 1;

  // 画垂直线
  function drawVerticalLine(coords: any) {
      drawLine(
          coords.x + 0.5,
          coords.y1 > coords.y2 ? coords.y2 : coords.y1,
          coords.x + 0.5,
          coords.y2 > coords.y1 ? coords.y2 : coords.y1);
  }

  // 画水平线
  function drawHorizontalLine(coords: any) {
      drawLine(
          coords.x1 > coords.x2 ? coords.x2 : coords.x1,
          coords.y + 0.5,
          coords.x2 > coords.x1 ? coords.x2 : coords.x1,
          coords.y + 0.5);
  }

  // 画线
  function drawLine(x1: any, y1: any, x2: any, y2: any) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(((x1+viewportTransform[4])*zoom), ((y1+viewportTransform[5])*zoom));
      ctx.lineTo(((x2+viewportTransform[4])*zoom), ((y2+viewportTransform[5])*zoom));
      ctx.stroke();
      ctx.restore();
  }

  // 范围
  function isInRange(value1: any, value2: any) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
          if (i === value2) {
              return true;
          }
      }
      return false;
  }

  const verticalLines: any = [],
      horizontalLines: any = [];

  // 移动
  canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
      zoom = canvas.getZoom();
  });

  // 对象移动事件（移动到某个点才具有辅助线的功能）
  canvas.on('object:moving', function(e: any) {

      let activeObject = e.target,
          canvasObjects = canvas.getObjects(),
          activeObjectCenter = activeObject.getCenterPoint(),
          activeObjectLeft = activeObjectCenter.x,
          activeObjectTop = activeObjectCenter.y,
          activeObjectBoundingRect = activeObject.getBoundingRect(),
          activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
          activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
          horizontalInTheRange = false,
          verticalInTheRange = false,
          transform = (canvas as any)._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (let i = canvasObjects.length; i--; ) {

          if (canvasObjects[i] === activeObject) continue;

          const objectCenter = canvasObjects[i].getCenterPoint(),
              objectLeft = objectCenter.x,
              objectTop = objectCenter.y,
              objectBoundingRect = canvasObjects[i].getBoundingRect(),
              objectHeight = objectBoundingRect.height / viewportTransform[3],
              objectWidth = objectBoundingRect.width / viewportTransform[0];

          // snap by the horizontal center line
          if (isInRange(objectLeft, activeObjectLeft)) {
              verticalInTheRange = true;
              verticalLines.push({
                  x: objectLeft,
                  y1: (objectTop < activeObjectTop)
                      ? (objectTop - objectHeight / 2 - aligningLineOffset)
                      : (objectTop + objectHeight / 2 + aligningLineOffset),
                  y2: (activeObjectTop > objectTop)
                      ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                      : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
          }

          // snap by the left edge
          if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
              verticalInTheRange = true;
              verticalLines.push({
                  x: objectLeft - objectWidth / 2,
                  y1: (objectTop < activeObjectTop)
                      ? (objectTop - objectHeight / 2 - aligningLineOffset)
                      : (objectTop + objectHeight / 2 + aligningLineOffset),
                  y2: (activeObjectTop > objectTop)
                      ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                      : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
          }

          // snap by the right edge
          if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
              verticalInTheRange = true;
              verticalLines.push({
                  x: objectLeft + objectWidth / 2,
                  y1: (objectTop < activeObjectTop)
                      ? (objectTop - objectHeight / 2 - aligningLineOffset)
                      : (objectTop + objectHeight / 2 + aligningLineOffset),
                  y2: (activeObjectTop > objectTop)
                      ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                      : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
          }

          // snap by the vertical center line
          if (isInRange(objectTop, activeObjectTop)) {
              horizontalInTheRange = true;
              horizontalLines.push({
                  y: objectTop,
                  x1: (objectLeft < activeObjectLeft)
                      ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                      : (objectLeft + objectWidth / 2 + aligningLineOffset),
                  x2: (activeObjectLeft > objectLeft)
                      ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                      : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
          }

          // snap by the top edge
          if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
              horizontalInTheRange = true;
              horizontalLines.push({
                  y: objectTop - objectHeight / 2,
                  x1: (objectLeft < activeObjectLeft)
                      ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                      : (objectLeft + objectWidth / 2 + aligningLineOffset),
                  x2: (activeObjectLeft > objectLeft)
                      ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                      : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
          }

          // snap by the bottom edge
          if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
              horizontalInTheRange = true;
              horizontalLines.push({
                  y: objectTop + objectHeight / 2,
                  x1: (objectLeft < activeObjectLeft)
                      ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                      : (objectLeft + objectWidth / 2 + aligningLineOffset),
                  x2: (activeObjectLeft > objectLeft)
                      ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                      : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
              });
              activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
          }
      }

      if (!horizontalInTheRange) {
          horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
          verticalLines.length = 0;
      }
  });

  // 结束绘画事件
  canvas.on('before:render', function() {
    canvas.clearContext((canvas as any).contextTop);
  });

  // 开始绘画事件（也就是图形开始变化）
  canvas.on('after:render', function() {
      for (let i = verticalLines.length; i--; ) {
          drawVerticalLine(verticalLines[i]);
      }
      for (let i = horizontalLines.length; i--; ) {
          drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
  });

  canvas.on('mouse:up', function() {
      verticalLines.length = horizontalLines.length = 0;
      canvas.renderAll();
  });
}