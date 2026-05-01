# Integrations placeholder

The legacy `quoteplan` project ships connectors for QuickBooks Desktop / Online,
Sage, Salesforce, Zoho, Deltek / Vantagepoint and AccountEdge.

This folder is the intended home for porting those integrations. Each integration
should live in its own subpackage:

```
integrations/
  quickbooks/
    client.py     # HTTP / SDK client
    service.py    # mapping <-> internal models
    routes.py     # optional API endpoints (mounted from app/api/v1/router.py)
```

Nothing is implemented yet — kept as a placeholder so the porting work has an
obvious landing spot.
