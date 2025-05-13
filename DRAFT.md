```
       monaco-edit(x) --------v
playState.active(x) -> monaco.content -> playState.tex
 +-> playState.svg -> html, playState.elem   | (just for monaco-edit)
        ^------------------------------------+
onEditMonaco -> playState.tex -> playState.svg
playState.active -> playState.svg -> svg -> html -> playState.elem
       +-> playState.tex -> tex -> monaco.content
[TODO]: `playState.tex` that changed by `playState.active` shouldn't affect `playState.svg`
```
