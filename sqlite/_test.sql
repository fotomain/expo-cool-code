SELECT

    CASE
        WHEN (v1 IS NULL) AND (v2 IS NULL) THEN 10000
        WHEN (v2 IS NULL) THEN v1+10
        ELSE  (v2+v1)/2.0
        END

FROM (SELECT
          (SELECT (
                      SELECT orderInList
                      FROM items1
                      WHERE mediaPostGUID = '222-Post-1764092712213'
                        AND mediaPostOwnerGUID = '111'
                  )
          ) AS v1,
          (SELECT (SELECT MIN(orderInList)
                   FROM items1
                   WHERE mediaPostOwnerGUID = '111'
                     AND orderInList >
                         (SELECT orderInList
                          FROM items1
                          WHERE mediaPostGUID = '222-Post-1764092712213'
                            AND mediaPostOwnerGUID = '111'
                         )
                  )) AS v2
     )
