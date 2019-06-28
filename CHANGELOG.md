# 2.1.1-alpha (2019-06-28)

### Bug Fixes

- **autoResize:** Exception caused by `autoResize` mixin.
- **charts:** `Legend` is blocked by slot and can't click.

# 2.1.0-alpha (2019-06-27)

### New

- **conicalColumnChart**
- **scrollRankingBoard**

# 2.0.0-alpha (2019-06-26)

### Perfect

- **SVG:** Refactoring **borderbox** and **decoration** components with SVG (Volume dropped to 6%).
- **charts:** New charting component that supports **animation**.
- **compatibility:** Better data compatibility.

### New

- **digitalFlop**
- **flylineChart**
- **borderBox**
- **decoration**

### Components

- **prefix:** Components add **dv** prefix to prevent conflicts.

```html
<!-- v 1.x.x -->
<decoration-1 />

<!-- v 2.x.x -->
<dv-decoration-1 />
```
